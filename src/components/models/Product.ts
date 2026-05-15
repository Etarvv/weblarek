import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
      private items: IProduct[] = [];
      private currentItem: IProduct | null = null;
      protected events: IEvents;

      constructor(events: IEvents) {
            this.events = events;
      }

      setItems(items: IProduct[]): void {
            this.items = items;
            this.events.emit("products:changed");
      }

      getItems(): IProduct[] {
            return this.items;
      }

      getItemById(id: string): IProduct | undefined {
            return this.items.find((item) => item.id === id);
      }

      setPreview(item: IProduct): void {
            this.currentItem = item;
            this.events.emit("preview:changed");
      }

      getPreview(): IProduct | null {
            return this.currentItem;
      }
}
