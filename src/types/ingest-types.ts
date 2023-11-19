type IngestStatus = "OK" | "Failed" | "Skipped"

export interface IngestStartResponse {
    status: IngestStatus,
    message: string
}