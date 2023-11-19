import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse";

export async function readCsv(file: string): Promise<[]> {
  const inputPath = path.join(__dirname, "..", "..", "data", file);

  const fileData = await fs.readFile(inputPath);

  const promise = new Promise<[]>((resolve) => {
    parse(fileData, { columns: true, trim: true }, function (err, rows) {
      resolve(rows);
    });
  });

  return promise;
}
