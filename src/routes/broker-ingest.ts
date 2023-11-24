import express from "express";
import { execute } from "../utils/api";
import { BrokerIngestController } from "../controllers/broker-ingest";
import { KNOWN_BROKERS } from "../utils/consts";

const router = express.Router();
router.post("/start-ingest", async (request: express.Request, response: express.Response) => {
  execute(
    request,
    response,
    async () => await (await controller()).startIngest(request.query.source?.toString() as KNOWN_BROKERS)
  );
});

const controller = async (): Promise<BrokerIngestController> => {
  return new BrokerIngestController();
};

export = router;
