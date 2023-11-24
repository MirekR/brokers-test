import { assert } from "chai";
import { ImportMock } from "ts-mock-imports";
import { BrokerIngestController } from "../../src/controllers/broker-ingest";

import * as csvProcessorModule from "../../src/processors/csv-processor";

describe("Broker ingest unit-test", () => {
  let csvProcessorMockManager;

  beforeEach(() => {
    csvProcessorMockManager = ImportMock.mockClass(csvProcessorModule, "CsvProcessor");
  });

  afterEach(() => {
    ImportMock.restore();
  });

  it("Should process data for given source", async () => {
    const testInjector: csvProcessorModule.BrokerInjector = {
      fileName: "test.csv",
      normaliseRowFn: csvProcessorModule.normaliseRowBroker1,
    };

    const brokerInjectorStub = ImportMock.mockFunction(csvProcessorModule, "getBrokerInjector", testInjector);
    const processCsvStub = csvProcessorMockManager.mock("processCsv");

    const controller = new BrokerIngestController();

    const response = await controller.startIngest("BROKER1");

    assert.equal(response.status, "OK");
    assert.isTrue(brokerInjectorStub.calledWith("BROKER1"), "Broker injector should have been called with BROKER1");

    const calledWith = processCsvStub.getCall(0).args;
    assert.equal(calledWith[0], testInjector.fileName);
    assert.equal(calledWith[1], "BROKER1");
  });
});
