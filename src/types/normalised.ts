export type ClientType = "Corporate" | "Private";

// Would need more information about the types per broker / insurer but making assumption they could fit into cats below
export type BusinessEventType = "New" | "Renewal" | "Update";

export interface BusinessEvent {
    type: BusinessEventType,
    order: number
}

export interface InsuranceRecord {
  source: string;
  policy: string;
  amount: number;
  startDateTimestamp?: number;
  endDateTimestamp?: number;
  client: string;
  clientType: ClientType;
  clientRef: string;
  businessEvent: BusinessEvent;
  adminFee: number;
  renewalDate?: Date;
  policyType: string;
  insurer: string;
  product: string;
  commission: number;
  sourceData: {}
}
