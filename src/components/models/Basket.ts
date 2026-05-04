import { IProduct } from "../../types/index.ts";

export class BasketData {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct) {
    this.items.push(item);
  }

  delete(id:string){
    this.items = this.items.filter(item => item.id !== id);
   }

   clear(): void {
    this.items = [];
   }

   getPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
   }

   getCountProduct():number{
    return this.items.length;
   }

   inBasket(id: string): boolean {
    return this.items.some((item) => item.id === id)
   }

}