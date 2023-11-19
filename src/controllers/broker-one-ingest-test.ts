import { assert } from "chai";
import { normaliseRow } from "./broker-one-ingest";

describe("Broker one ingest unit-test", () => {
  it("Normalised row", async () => {
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
    const normalised = await normaliseRow(inputData);

    // TODO Bit brital assertion, update to check fields
    assert.equal(
      JSON.stringify(normalised),
      '{"source":"BROKER1","policy":"POL002","amount":750000,"startDateTimestamp":1675987200000,"endDateTimestamp":1707523200000,"adminFee":75,"businessEvent":{"type":"Renewal","order":2},"client":"Business XYZ","clientRef":"CR002","clientType":"Individual","commission":0,"insurer":"XYZ Insurers","policyType":"Auto","product":"Auto Coverage","sourceData":{"PolicyNumber":"POL002","InsuredAmount":"750000","StartDate":"10/02/2023","EndDate":"10/02/2024","AdminFee":"75","BusinessDescription":"Business XYZ","BusinessEvent":"Renewal","ClientType":"Individual","ClientRef":"CR002","Commission":"0.12","EffectiveDate":"10/02/2023","InsurerPolicyNumber":"IPN002","IPTAmount":"100","Premium":"6000","PolicyFee":"30","PolicyType":"Auto","Insurer":"XYZ Insurers","Product":"Auto Coverage","RenewalDate":"10/02/2024","RootPolicyRef":"RP002"}}',
      "Normalised data don't mach expected result"
    );
  });

  it("Faile normalise row", async () => {
    const inputData = {
      PolicyNumber: "POL002",
      InsuredAmount: "750000",
      StartDate: "10000/02/2023",
      EndDate: "10/02/2024",
      AdminFee: "khkhkj",
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
    const normalised = await normaliseRow(inputData);
    assert.equal(normalised, null, "Normalised data should be null");
  });
});
