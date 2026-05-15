import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketView {
      total: number;
      items: HTMLElement[];
}

export class BasketView extends Component<IBasketView> {
      protected totalSpan: HTMLElement;
      protected listElement: HTMLElement;
      protected submitBtn: HTMLButtonElement;

      constructor(
            container: HTMLElement,
            protected events: IEvents,
      ) {
            super(container);
            this.listElement = ensureElement(".basket__list", container);
            this.totalSpan = ensureElement(".basket__price", container);
            this.submitBtn = ensureElement(
                  ".basket__button",
                  container,
            ) as HTMLButtonElement;
            this.submitBtn.addEventListener("click", () =>
                  this.events.emit("order:start"),
            );
      }

      set total(amount: number) {
            this.totalSpan.textContent = `${amount} синапсов`;
      }

      set items(items: HTMLElement[]) {
            this.listElement.replaceChildren(...items);
      }

      set disabled(state: boolean) {
            this.submitBtn.disabled = state;
      }
}
