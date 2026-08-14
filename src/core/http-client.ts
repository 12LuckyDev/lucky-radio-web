export class HttpClient {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  public get baseUrl(): string {
    return this._baseUrl;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);

    headers.set("Content-Type", "application/json");

    const response = await fetch(`${this._baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();

    if (text === "") {
      return undefined as T;
    }

    return JSON.parse(text);
  }

  public get<R>(url: string): Promise<R> {
    return this.request<R>(url);
  }

  public post<T, R = void>(url: string, body?: T): Promise<R> {
    return this.request<R>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public put<T, R = void>(url: string, body?: T): Promise<R> {
    return this.request<R>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public patch<T, R = void>(url: string, body?: T): Promise<R> {
    return this.request<R>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  public delete<R = void>(url: string): Promise<R> {
    return this.request<R>(url, {
      method: "DELETE",
    });
  }
}
