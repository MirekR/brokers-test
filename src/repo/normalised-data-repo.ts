import { InsuranceRecord } from "../types/normalised";

let DATABASE: InsuranceRecord[] = [];

// Normally this would be database some sort and would need to be async -> making sure we would not need to change code once
// DB was decided
class NormalisedDataRepo {
  public async deleteAll() {
    DATABASE = [];
  }

  // Insert should handle duplicates, in actual database would have compounded index of policy and event type
  // as seems same policy can come from two different brokers after update / renewal - like for example POL044 or REF053
  public async insert(rows: InsuranceRecord[]) {
    DATABASE.push(...rows);
  }

  public async getAll(source?: string) {
    return source ? DATABASE.filter((row) => row.source === source) : DATABASE;
  }

  public async getAllLatest(source?: string, timestamp?: number): Promise<InsuranceRecord[]> {
    timestamp = timestamp || Date.now();
    // There needs to be logic what update is consider the latest, from the data is unclear, but would assume some logic around the Contract Event field
    // and / or when data were received. Could there be potential race condition in that case, like example if broker1 closes contract but sends data once a week
    // but client goes next day to broker2 who gives them better quote but broker2 send data once a day?
    const uniquePolicies = (await this.getAll(source))
      .filter((row) => row.startDateTimestamp <= timestamp && row.endDateTimestamp >= timestamp) // filter active
      .reduce((reducedData: {}, current: InsuranceRecord) => {
        const previous = reducedData[current.policy] as InsuranceRecord;
        if (previous?.businessEvent?.order || -1 < current?.businessEvent?.order || -1) {
          reducedData[current.policy] = current;
        }
        return reducedData;
      }, {});

    return Object.values(uniquePolicies);
  }

  public async getTotalNumberOfPolicies(source?: string, timestamp?: number): Promise<number> {
    return (await this.getAllLatest(source, timestamp)).length;
  }

  // Question: for total insured value per source, how updated polices are counted if they done via different broker?
  public async getTotalInsuredValue(source?: string, timestamp?: number): Promise<number> {
    return (await this.getAllLatest(source, timestamp)).reduce(
      (sum: number, current: InsuranceRecord) => sum + current.amount,
      0
    );
  }

  // Question: for total insured customers number per source, how updated polices are counted if they done via different broker?
  // What about admin fees? What's the policy about updates, do both brokers get the fee or only the last one?
  public async getTotalNumCustomers(source?: string, timestamp?: number): Promise<number> {
    return new Set((await this.getAllLatest(source, timestamp)).map((row) => row.client)).size;
  }
}

export const repo = new NormalisedDataRepo();
