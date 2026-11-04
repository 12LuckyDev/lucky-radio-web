import type { HttpClient } from "../../../core/http-client";

export class GlobalHttpClient {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getCurrent(): Promise<{ current: string }> {
    return this.http.get("/current-player");
  }
}
