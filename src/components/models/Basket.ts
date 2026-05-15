import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class BasketData {
      protected items: IProduct[] = [];
      protected events: IEvents;

      constructor(events: IEvents) {
            this.events = events;
      }

      getItems(): IProduct[] {
            return this.items;
      }

      addItem(item: IProduct) {
            if (this.inBasket(item.id)) return;
            this.items.push(item);
            this.events.emit("basket:changed");
      }

      delete(id: string) {
            this.items = this.items.filter((item) => item.id !== id);
            this.events.emit("basket:changed");
      }

      clear(): void {
            this.items = [];
            this.events.emit("basket:changed");
      }

      getPrice(): number {
            return this.items.reduce(
                  (total, item) => total + (item.price ?? 0),
                  0,
            );
      }

      getCountProduct(): number {
            return this.items.length;
      }

      inBasket(id: string): boolean {
            return this.items.some((item) => item.id === id);
      }
}
