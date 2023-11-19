import { Post, Route, Tags } from "tsoa";
import { IngestStartResponse } from "../types/ingest-types";
import { InsuranceRecord, ClientType } from "../types/normalised";
import { readCsv } from "../utils/csv-reader";
import { repo as normalisedDataRepo } from "../repo/normalised-data-repo";
import { repo as failedDataRepo } from "../repo/failed-data-repo";
import { matchBusinessEven, parseDate, parseToNumberOrThrow } from "../utils/parse-utils";
import { BROKER1_SOURCE } from "../utils/consts";

let ingested: boolean = false;

@Route(`/broker-api/broker-one-ingest`)
@Tags("broker-one-ingest")
export class BrokerOneIngestController {
  @Post("/start-ingest")
  public async startIngest(): Promise<IngestStartResponse> {
    // there should be logic to avoid duplicated processing or have properly defined rules what happens when we process file for second time.
    // like if there differences etc
    if (ingested) {
      return {
        status: "Skipped",
        message: "This file has already been processed",
      };
    }

    const data = await readCsv("broker1.csv");
    console.log({ data });
    const records = data.map(async (row) => await normaliseRow(row));

    await normalisedDataRepo.insert((await Promise.all(records)).filter((row) => row));

    ingested = true;
    return {
      status: "OK",
      message: "Ingest started",
    };
  }
}

export async function normaliseRow(row: {}): Promise<InsuranceRecord> {
  //TODO more granular validation would be needed
  try {
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
  } catch (ex) {
    console.log(ex);
    await failedDataRepo.insert(row, ex.message, BROKER1_SOURCE);
    return null;
  }
}