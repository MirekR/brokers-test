import express from "express"; 
import crypto from "crypto";

// Docs: We normally have here sentry tracing for exceptions and general monitoring
export async function execute(request: express.Request, response: express.Response, fn) {
  const path = request.path;
  const method = request.method;

  const tag = `API_CALL_${method}:${path}_${crypto.randomUUID()}`;
  console.time(tag);
  printMemoryUsage(tag, "start");

  try {
    const fnResp = await fn();
    response.json(fnResp);
  } catch (ex) {
    console.log(`API Exception:`);
    console.log(ex);
    response.statusMessage = ex.message;
    response.status(ex.statusCode || 500).send({ error: ex.message, code: ex.code, ...ex.extra });

  } finally {
    printMemoryUsage(tag, "end");
    console.timeEnd(tag);
  }
}

function printMemoryUsage(tag: string, label: string) {
  if (process.env.MEMORY_LOG === "true") {
    console.timeLog(tag, label, JSON.stringify(process.memoryUsage()));
  }
}
