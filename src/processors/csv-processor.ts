import { ClientType, InsuranceRecord } from "../types/normalised";
import { readCsv } from "../utils/csv-reader";
import { repo as normalisedDataRepo } from "../repo/normalised-data-repo";
import { repo as failedDataRepo } from "../repo/failed-data-repo";
import { BROKER1_SOURCE, BROKER2_SOURCE } from "../utils/consts";
import { matchBusinessEven, parseDate, parseToNumberOrThrow } from "../utils/parse-utils";

export class CsvProcessor {
  public async processCsv(fileName: string, source: string, normaliseRow: (row: {}) => Promise<InsuranceRecord>) {
    const data = await readCsv(fileName);
    const records = await Promise.all(data.map(async (row) => await this.processRow(source, row, normaliseRow)));

    await normalisedDataRepo().insert(records.filter((row) => row));
  }

  public async processRow(source: string, row: {}, normaliseRow: (row: {}) => Promise<InsuranceRecord>) {
    try {
      return await normaliseRow(row);
    } catch (ex) {
      console.log(ex);
      await failedDataRepo().insert(row, ex.message, source);
      return null;
    }
  }
}

export interface BrokerInjector {
  fileName: string;
  normaliseRowFn: (row: {}) => Promise<InsuranceRecord>;
}

// Data for this could be loaded from database / config file or something like this once pattern of data is clearer. 
export function getBrokerInjector(source: string): BrokerInjector {
  if (source === BROKER1_SOURCE) {
    return {
      fileName: "broker1.csv",
      normaliseRowFn: normaliseRowBroker1,
    };
  } else if (source === BROKER2_SOURCE) {
    return {
      fileName: "broker2.csv",
      normaliseRowFn: normaliseRowBroker2,
    };
  }
}

export async function normaliseRowBroker1(row: {}): Promise<InsuranceRecord> {
  //TODO more granular validation would be needed

  return {
    source: BROKER1_SOURCE,
    policy: row["PolicyNumber"],
    amount: parseToNumberOrThrow(row["InsuredAmount"]),
    startDateTimestamp: parseDate(row["StartDate"]),
    endDateTimestamp: parseDate(row["EndDate"]),
    adminFee: parseToNumberOrThrow(row["AdminFee"]),
    businessEvent: matchBusinessEven(row["BusinessEvent"]),
    client: row["BusinessDescription"],
    clientRef: row["ClientRef"],
    clientType: row["ClientType"] as ClientType,
    commission: parseToNumberOrThrow(row["Commission"]),
    insurer: row["Insurer"],
    policyType: row["PolicyType"],
    product: row["Product"],
    sourceData: row,
  };
}

export async function normaliseRowBroker2(row: {}): Promise<InsuranceRecord> {
  //TODO more granular validation would be needed
  return {
    source: BROKER2_SOURCE,
    policy: row["PolicyNumber"],
    amount: parseToNumberOrThrow(row["CoverageAmount"]),
    startDateTimestamp: parseDate(row["InitiationDate"]),
    endDateTimestamp: parseDate(row["ExpirationDate"]),
    adminFee: parseToNumberOrThrow(row["AdminCharges"]),
    businessEvent: matchBusinessEven(row["ContractEvent"]),
    client: row["CompanyDescription"],
    clientRef: row["ConsumerID"],
    clientType: row["ConsumerCategory"] as ClientType,
    commission: parseToNumberOrThrow(row["BrokerFee"]),
    insurer: row["Underwriter"],
    policyType: row["ContractCategory"],
    product: row["InsurancePlan"],
    sourceData: row,
  };
}
