export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }

  export type TPayment = "cash" | "card";

  export interface IBuyer {
    email: string;
    phone: string;
    address: string;
    payment: TPayment | null;
}

export interface IProductResponse {
  total:number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  items:string[];
  total:number;
}

export interface IOrderResponse {
  id:string;
  total:number;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;