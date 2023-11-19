import { Number } from "aws-sdk/clients/iot";
import { BusinessEvent } from "../types/normalised";

// `Docs: at the moment supports only dd/mm/yyyy format
export function parseDate(str: string): Number {
  const parts = str.split("/");
  

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JavaScript Date
    const year = parseInt(parts[2], 10);

    // Check if the parsed values are valid
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day).getTime();
    }
  }

  throw new Error(`"${str}" is not a valid date in format dd/mm/yyyy.`);
}

export function parseToNumberOrThrow(str: string) {
  const num = parseInt(str);

  if (isNaN(num)) {
    throw new Error(`"${str}" is not a valid number.`);
  }

  return num;
}

export function matchBusinessEven(event: string): BusinessEvent {
  switch (event) {
    case "New Business":
      return { type: "New", order: 1 };
    case "Policy Renewal":
      return { type: "Renewal", order: 2 };
    case "Contract Renewal":
      return { type: "Renewal", order: 2 };
    case "Renewal":
      return { type: "Renewal", order: 2 };
    case "Policy Update":
      return { type: "Update", order: 2 };
  }
}
