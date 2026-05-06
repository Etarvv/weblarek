import {
  IApi,
  IOrder,
  IOrderResponse,
  IProductResponse,
} from "../types";

export class WebLarekAPI {
  private baseApi: IApi;

  constructor(api: IApi) {
    this.baseApi = api;
  }

  async getProducts(): Promise<IProductResponse> {
    const response = await this.baseApi.get<IProductResponse>("/product");
    return response;
  }

  async orderProducts(order: IOrder): Promise<IOrderResponse> {
    const response = await this.baseApi.post<IOrderResponse>("/order", order);
    return response;
  }
}
