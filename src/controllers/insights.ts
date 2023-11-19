import { Get, Query, Route, Tags } from "tsoa";
import { InsuranceRecord } from "../types/normalised";
import { repo } from "../repo/normalised-data-repo";
import { KNOWN_BROKERS } from "../utils/consts";

interface NumericResponse {
  value: number;
}

@Route(`/broker-api/insights`)
@Tags("insights")
export class InsightsController {
  @Get()
  public async getAll(@Query() source?: KNOWN_BROKERS, @Query() activeAtTimestamp?: number): Promise<InsuranceRecord[]> {
    return repo.getAllLatest(source, activeAtTimestamp);
  }

  @Get("/total-number-of-policies")
  public async getTotalNumberOfPolicies(@Query() source?: KNOWN_BROKERS, @Query() activeAtTimestamp?: number): Promise<NumericResponse> {
    return {
      value: await repo.getTotalNumberOfPolicies(source, activeAtTimestamp),
    };
  }

  @Get("/total-insured-value")
  public async getTotalInsuredValue(@Query() source?: KNOWN_BROKERS, @Query() activeAtTimestamp?: number): Promise<NumericResponse> {
    return {
      value: await repo.getTotalInsuredValue(source, activeAtTimestamp),
    };
  }

  @Get("/total-number-of-customers")
  public async getTotalNumCustomers(@Query() source?: KNOWN_BROKERS, @Query() activeAtTimestamp?: number): Promise<NumericResponse> {
    return { value: await repo.getTotalNumCustomers(source, activeAtTimestamp) };
  }
}
