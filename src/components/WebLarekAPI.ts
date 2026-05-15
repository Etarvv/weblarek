import { IApi } from "../types";
import { IOrder, IOrderResponse, IProductResponse } from "../types";

export class WebLarekAPI {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>("/product");
    }

    async orderProducts(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>("/order", order);
    }
}