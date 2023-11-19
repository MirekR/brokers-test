import express from "express";
import { execute } from "../utils/api";
import { BrokerTwoIngestController } from "../controllers/broker-two-ingest";

const router = express.Router();
router.post("/start-ingest", async (request: express.Request, response: express.Response) => {
  execute(request, response, async () => await (await controller()).startIngest());
});

const controller = async (): Promise<BrokerTwoIngestController> => {
  return new BrokerTwoIngestController();
};

export = router;
