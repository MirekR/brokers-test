import express from "express";
import { execute } from "../utils/api";
import { BrokerOneIngestController } from "../controllers/broker-one-ingest";

const router = express.Router();
router.post("/start-ingest", async (request: express.Request, response: express.Response) => {
  execute(request, response, async () => await (await controller()).startIngest());
});

const controller = async (): Promise<BrokerOneIngestController> => {
  return new BrokerOneIngestController();
};

export = router;
