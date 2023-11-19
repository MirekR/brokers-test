import { assert } from "chai";
import { repo } from "../repo/normalised-data-repo";
import { InsightsController } from "./insights";
import { InsuranceRecord } from "../types/normalised";

describe("Insights contoller integration-test", () => {
  it("Init data", async () => {
    await repo.deleteAll();
    const testData: InsuranceRecord[] = [
      {
        source: "BROKER1",
        policy: "POL002",
        amount: 750000,
        startDateTimestamp: 1696201200000,
        endDateTimestamp: 1727823600000,
        adminFee: 75,
        businessEvent: { type: "Renewal", order: 2 },
        client: "Business XYZ",
        clientRef: "CR002",
        clientType: "Private",
        commission: 0.12,
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
      },
      {
        source: "BROKER2",
        policy: "POL003",
        amount: 500000,
        startDateTimestamp: 1679270400000,
        endDateTimestamp: 1710892800000,
        adminFee: 50,
        businessEvent: { type: "Renewal", order: 2 },
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
          StartDate: "20/03/2023",
          EndDate: "20/03/2024",
          AdminFee: "50",
          BusinessDescription: "Business PQR",
          BusinessEvent: "Policy Renewal",
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
      },
      {
        source: "BROKER2",
        policy: "POL003",
        amount: 500000,
        startDateTimestamp: 1710892800000,
        endDateTimestamp: 1742428800000,
        adminFee: 50,
        businessEvent: { type: "Renewal", order: 2 },
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
          StartDate: "20/03/2024",
          EndDate: "20/03/2025",
          AdminFee: "50",
          BusinessDescription: "Business PQR",
          BusinessEvent: "Policy Renewal",
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
      },
    ];

    await repo.insert(testData);
  });

  it("Total number of clients 24-25", async () => {
    const response = await new InsightsController().getTotalNumCustomers(null, 1734652800000);
    assert.equal(response.value, 1);
  });

  it("Total number of clients for one broker", async () => {
    const response = await new InsightsController().getTotalNumCustomers("BROKER1");
    assert.equal(response.value, 1);
  });

  it("Total insured value for one broker", async () => {
    const response = await new InsightsController().getTotalInsuredValue("BROKER1");
    assert.equal(response.value, 750000);
  });
});
