import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export class Order extends Component<IBuyer> {
      protected submit: HTMLButtonElement;
      protected _errors: HTMLElement;
      protected buttons: HTMLButtonElement[];

      constructor(
            protected container: HTMLFormElement,
            protected events: IEvents,
      ) {
            super(container);

            this.submit = container.querySelector(
                  'button[type="submit"]',
            ) as HTMLButtonElement;
            this._errors = container.querySelector(
                  ".form__errors",
            ) as HTMLElement;
            this.buttons = Array.from(
                  container.querySelectorAll(".button_alt"),
            );

            this.buttons.forEach((button) => {
                  button.addEventListener("click", () => {
                        this.onInputChange("payment", button.name);
                  });
            });

            this.container.addEventListener("input", (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  const field = target.name as keyof IBuyer;
                  const value = target.value;
                  this.onInputChange(field, value);
            });

            this.container.addEventListener("submit", (e: Event) => {
                  e.preventDefault();
                  this.events.emit(`${this.container.name}:submit`);
            });
      }

      protected onInputChange(field: keyof IBuyer, value: string) {
            this.events.emit(`${this.container.name}.${String(field)}:change`, {
                  field,
                  value,
            });
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
            (
                  this.container.elements.namedItem(
                        "address",
                  ) as HTMLInputElement
            ).value = value;
      }

      set valid(value: boolean) {
            this.setDisabled(this.submit, !value);
      }

      set errors(value: string) {
            this.setText(this._errors, value);
      }

      render(state: Partial<IBuyer> & { valid?: boolean; errors?: string }) {
            const { valid, errors, ...inputs } = state;
            if (valid !== undefined) this.valid = valid;
            if (errors !== undefined) this.errors = errors;
            Object.assign(this, inputs);
            return this.container;
      }
}
