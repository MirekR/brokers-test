interface ErroredData {
  data: {};
  error: string;
  source: string;
  timestamp: number;
}

const DATABASE: ErroredData[] = [];

class FailedDataRepo {
  // Normally this would be database some sort and would need to be async -> making sure we would not need to change code once
  // DB was decided

  public async insert(row: {}, error: string, source: string) {
    DATABASE.push({
      data: row,
      error,
      source,
      timestamp: Date.now()
    });
  }
  public async getAll() {
    return DATABASE;
  }
}

export const repo = new FailedDataRepo();
