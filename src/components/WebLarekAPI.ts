import { Api } from "./base/Api";
import { IOrder, IOrderResponse, IProductResponse } from "../types";

export class WebLarekAPI {
      private api: Api;

      constructor(baseUrl: string) {
            this.api = new Api(baseUrl);
      }

      async getProducts(): Promise<IProductResponse> {
            return this.api.get<IProductResponse>("/product");
      }

      async orderProducts(order: IOrder): Promise<IOrderResponse> {
            return this.api.post<IOrderResponse>("/order", order);
      }
}
