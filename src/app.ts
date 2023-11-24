require("dotenv").config();
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import brokerIngestRoutes from "./routes/broker-ingest";
import insightsRoutes from "./routes/insights";

const app = express();
const port = Number(process.env.LISTNER_PORT) || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
  express.json()(req, res, next);
});

app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json"
    },
  })
);

// Docs: path prefix per (micro) service for cleaner mapping on loadbalancers 
app.use(`/broker-api/broker-ingest/`, brokerIngestRoutes);
app.use(`/broker-api/insights/`, insightsRoutes);

// health check
app.get("/", function (req, res) {
  res.status(200).send("All alive, Dave ... I'm laying, everyone is dead!");
});