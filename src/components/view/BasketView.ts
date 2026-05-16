import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IBasketView {
      total: number;
      items: HTMLElement[];
      disabled: boolean;
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

            this.submitBtn.addEventListener("click", () => {
                  this.events.emit("order:start");
            });
      }

      set total(value: number) {
            this.setText(this.totalSpan, `${value} синапсов`);
      }

      set items(items: HTMLElement[]) {
            if (items.length) {
                  this.listElement.replaceChildren(...items);
            } else {
                  this.listElement.replaceChildren();
            }
      }

      set disabled(value: boolean) {
            this.setDisabled(this.submitBtn, value);
      }
}
