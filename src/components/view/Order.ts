import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class Order extends Form<IBuyer> {
      protected buttons: HTMLButtonElement[];

      constructor(container: HTMLFormElement, events: IEvents) {
            super(container, events, "order");
            this.buttons = Array.from(
                  container.querySelectorAll(".button_alt"),
            );

            this.buttons.forEach((button) => {
                  button.addEventListener("click", () => {
                        this.onInputChange("payment", button.name);
                  });
            });

            const addressInput = this.container.elements.namedItem(
                  "address",
            ) as HTMLInputElement;
            if (addressInput) {
                  addressInput.addEventListener("input", (e) => {
                        this.onInputChange(
                              "address",
                              (e.target as HTMLInputElement).value,
                        );
                  });
            }
      }

      set payment(name: string) {
            this.buttons.forEach((button) => {
                  this.toggleClass(
                        button,
                        "button_alt-active",
                        button.name === name,
                  );
            });
      }

      set address(value: string) {
            const input = this.container.elements.namedItem(
                  "address",
            ) as HTMLInputElement;
            if (input) input.value = value;
      }
}
