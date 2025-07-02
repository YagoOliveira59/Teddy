import type { AxiosInstance } from "axios";

export class AuthRemoteDataSource {
  private readonly httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const response = await this.httpClient.post("/auth/login", credentials);
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProfile(): Promise<any> {
    const response = await this.httpClient.get("/auth/profile");
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(data: any): Promise<any> {
    const response = await this.httpClient.post("/users", data);
    return response.data;
  }
}
