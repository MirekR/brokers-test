import express from "express";
import { execute } from "../utils/api";
import { InsightsController } from "../controllers/insights";
import { KNOWN_BROKERS } from "../utils/consts";

const router = express.Router();
router.get("/", async (request: express.Request, response: express.Response) => {
  execute(
    request,
    response,
    async () => await (await controller()).getAll(request.query.source?.toString() as KNOWN_BROKERS)
  );
});

router.get("/total-number-of-policies", async (request: express.Request, response: express.Response) => {
  execute(
    request,
    response,
    async () => await (await controller()).getTotalNumberOfPolicies(request.query.source?.toString() as KNOWN_BROKERS)
  );
});

router.get("/total-insured-value", async (request: express.Request, response: express.Response) => {
  execute(
    request,
    response,
    async () => await (await controller()).getTotalInsuredValue(request.query.source?.toString() as KNOWN_BROKERS)
  );
});

router.get("/total-number-of-customers", async (request: express.Request, response: express.Response) => {
  execute(
    request,
    response,
    async () => await (await controller()).getTotalNumCustomers(request.query.source?.toString() as KNOWN_BROKERS)
  );
});

const controller = async (): Promise<InsightsController> => {
  return new InsightsController();
};

export = router;
