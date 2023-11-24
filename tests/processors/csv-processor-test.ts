import { assert } from "chai";
import util from "util";
import { ImportMock } from "ts-mock-imports";
import { CsvProcessor, normaliseRowBroker1 } from "../../src/processors/csv-processor";

import * as failedDataModule from "../../src/repo/failed-data-repo";
import * as normalisedDataModule from "../../src/repo/normalised-data-repo";
import * as csvReaderModule from "../../src/utils/csv-reader";

import { InsuranceRecord } from "../../src/types/normalised";

describe("Normalised data repository unit-test", () => {
  let failedDataRepoMockManager;
  let normalisedDataRepoMockManager;
  let csvReaderStub;

  beforeEach(() => {
    failedDataRepoMockManager = ImportMock.mockClass(failedDataModule, "FailedDataRepo");
    ImportMock.mockFunction(failedDataModule, "repo", failedDataRepoMockManager.getMockInstance());

    normalisedDataRepoMockManager = ImportMock.mockClass(normalisedDataModule, "NormalisedDataRepo");
    ImportMock.mockFunction(normalisedDataModule, "repo", normalisedDataRepoMockManager.getMockInstance());

    csvReaderStub = ImportMock.mockFunction(csvReaderModule, "readCsv", [{ some: "data" }]);
  });

  afterEach(() => {
    ImportMock.restore();
  });

  it("Should write normalised row into the database", async () => {
    const insertStub = normalisedDataRepoMockManager.mock("insert");

    const insuranceRecord: InsuranceRecord = {
      source: "BROKER2",
      policy: "POL003",
      amount: 400000,
      startDateTimestamp: 1679270400000,
      endDateTimestamp: 1710892800000,
      adminFee: 50,
      businessEvent: { type: "Update", order: 3 },
      client: "Business PQR",
      clientRef: "CR003",
      clientType: "Corporate",
      commission: 0.1,
      insurer: "PQR Underwriters",
      policyType: "Health",
      product: "Health Insurance",
      sourceData: {
        PolicyNumber: "POL003",
        InsuredAmount: "500000",
        StartDate: "20/04/2023",
        EndDate: "20/03/2024",
        AdminFee: "50",
        BusinessDescription: "Business PQR",
        BusinessEvent: "Update",
        ClientType: "Corporate",
        ClientRef: "CR003",
        Commission: "0.1",
        EffectiveDate: "20/03/2023",
        InsurerPolicyNumber: "IPN003",
        IPTAmount: "75",
        Premium: "4000",
        PolicyFee: "25",
        PolicyType: "Health",
        Insurer: "PQR Underwriters",
        Product: "Health Insurance",
        RenewalDate: "20/03/2024",
        RootPolicyRef: "RP003",
      },
    };

    const testFileName = "test.csv";
    const testSource = "TestSource";

    await new CsvProcessor().processCsv(testFileName, testSource, async (row: {}) => insuranceRecord);

    assert.isTrue(insertStub.calledWith([insuranceRecord]), "Insert stub hasn't been called with expected values");

    assert.isTrue(
      csvReaderStub.calledWith(testFileName),
      `Csv read should have been called with file name ${testFileName}`
    );
  });

  it("Should fail the normalisation and write into the failed repo", async () => {
    const insertStub = failedDataRepoMockManager.mock("insert");

    const testValue = { test: "value" };
    const errorMessage = "You shall not pass";
    const testSource = "TestSource";

    new CsvProcessor().processRow(testSource, testValue, (row: {}) => {
      throw new Error(errorMessage);
    });

    assert.isTrue(
      insertStub.calledWith(testValue, errorMessage, testSource),
      "Insert stub hasn't been called with expected values"
    );
  });

  it("Should Normalised broker 1 row", async () => {
    const inputData = {
      PolicyNumber: "POL002",
      InsuredAmount: "750000",
      StartDate: "10/02/2023",
      EndDate: "10/02/2024",
      AdminFee: "75",
      BusinessDescription: "Business XYZ",
      BusinessEvent: "Renewal",
      ClientType: "Individual",
      ClientRef: "CR002",
      Commission: "0.12",
      EffectiveDate: "10/02/2023",
      InsurerPolicyNumber: "IPN002",
      IPTAmount: "100",
      Premium: "6000",
      PolicyFee: "30",
      PolicyType: "Auto",
      Insurer: "XYZ Insurers",
      Product: "Auto Coverage",
      RenewalDate: "10/02/2024",
      RootPolicyRef: "RP002",
    };
    const normalised = await normaliseRowBroker1(inputData);

    assert.equal(normalised.policy, "POL002");
    assert.equal(normalised.amount, 750000);
    assert.equal(normalised.startDateTimestamp, 1675987200000);
    assert.equal(normalised.endDateTimestamp, 1707523200000);

    const expectedResult = {
      source: "BROKER1",
      policy: "POL002",
      amount: 750000,
      startDateTimestamp: 1675987200000,
      endDateTimestamp: 1707523200000,
      adminFee: 75,
      businessEvent: { type: "Renewal", order: 2 },
      client: "Business XYZ",
      clientRef: "CR002",
      clientType: "Individual",
      commission: 0,
      insurer: "XYZ Insurers",
      policyType: "Auto",
      product: "Auto Coverage",
      sourceData: {
        PolicyNumber: "POL002",
        InsuredAmount: "750000",
        StartDate: "10/02/2023",
        EndDate: "10/02/2024",
        AdminFee: "75",
        BusinessDescription: "Business XYZ",
        BusinessEvent: "Renewal",
        ClientType: "Individual",
        ClientRef: "CR002",
        Commission: "0.12",
        EffectiveDate: "10/02/2023",
        InsurerPolicyNumber: "IPN002",
        IPTAmount: "100",
        Premium: "6000",
        PolicyFee: "30",
        PolicyType: "Auto",
        Insurer: "XYZ Insurers",
        Product: "Auto Coverage",
        RenewalDate: "10/02/2024",
        RootPolicyRef: "RP002",
      },
    };

    // Bit brital assertion, but might be worth keeping it to over all normalisation, not just over selected fields
    assert.isTrue(util.isDeepStrictEqual(normalised, expectedResult));
  });
});
