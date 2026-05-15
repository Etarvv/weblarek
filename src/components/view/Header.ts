import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface IHeader {
      counter: number;
}

export class Header extends Component<IHeader> {
      protected counterElement: HTMLElement;
      protected basket: HTMLElement;

      constructor(
            container: HTMLElement,
            protected events: IEvents,
      ) {
            super(container);

            this.counterElement = container.querySelector(
                  ".header__basket-counter",
            ) as HTMLElement;
            this.basket = container.querySelector(
                  ".header__basket",
            ) as HTMLElement;

            this.basket.addEventListener("click", () => {
                  this.events.emit("basket:open");
            });
      }

      set counter(value: number) {
            this.setText(this.counterElement, String(value));
      }
}
