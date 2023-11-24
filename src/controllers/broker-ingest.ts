import { Post, Query, Route, Tags } from "tsoa";
import { IngestStartResponse } from "../types/ingest-types";
import { KNOWN_BROKERS } from "../utils/consts";
import { CsvProcessor, getBrokerInjector } from "../processors/csv-processor";

const ingested = {};

@Route(`/broker-api/broker-ingest`)
@Tags("broker-ingest")
export class BrokerIngestController {
  @Post("/start-ingest")
  public async startIngest(@Query() source: KNOWN_BROKERS): Promise<IngestStartResponse> {
    // there should be logic to avoid duplicated processing or have properly defined rules what happens when we process file for second time.
    // like if there differences etc
    if (ingested[source]) {
      return {
        status: "Skipped",
        message: "This file has already been processed",
      };
    }

    const injector = getBrokerInjector(source);
    new CsvProcessor().processCsv(injector.fileName, source, injector.normaliseRowFn);

    ingested[source] = true;
    return {
      status: "OK",
      message: "Ingest started",
    };
  }
}
