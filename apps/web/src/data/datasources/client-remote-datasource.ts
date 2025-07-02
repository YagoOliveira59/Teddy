import type { AxiosInstance } from "axios";
import type { Client } from "../../domain/entities/client";

export class ClientRemoteDataSource {
  private readonly httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async getAll(): Promise<Client[]> {
    const response = await this.httpClient.get("/clients");
    return response.data;
  }

  async create(data: Omit<Client, "id">): Promise<Client> {
    const response = await this.httpClient.post("/clients", data);
    return response.data;
  }

  async update(id: string, data: Partial<Omit<Client, "id">>): Promise<Client> {
    const response = await this.httpClient.patch(`/clients/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(`/clients/${id}`);
  }

  async getSelectedClients(): Promise<Client[]> {
    const response = await this.httpClient.get("/portfolio");
    return response.data;
  }

  async addClientToSelection(id: string): Promise<void> {
    await this.httpClient.post(`/portfolio/${id}/select`);
  }

  async removeClientFromSelection(id: string): Promise<void> {
    await this.httpClient.delete(`/portfolio/${id}/deselect`);
  }

  async clearAllSelectedClients(): Promise<void> {
    await this.httpClient.delete("/portfolio/all");
  }
}
