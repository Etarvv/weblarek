import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form<IBuyer> {
      constructor(container: HTMLFormElement, events: IEvents) {
            super(container, events, "contacts");

            const emailInput = this.container.querySelector(
                  '[name="email"]',
            ) as HTMLInputElement;
            const phoneInput = this.container.querySelector(
                  '[name="phone"]',
            ) as HTMLInputElement;

            emailInput?.addEventListener("input", (e) =>
                  this.onInputChange(
                        "email",
                        (e.target as HTMLInputElement).value,
                  ),
            );
            phoneInput?.addEventListener("input", (e) =>
                  this.onInputChange(
                        "phone",
                        (e.target as HTMLInputElement).value,
                  ),
            );
      }

      set email(value: string) {
            const input = this.container.querySelector(
                  '[name="email"]',
            ) as HTMLInputElement;
            if (input) input.value = value;
      }

      set phone(value: string) {
            const input = this.container.querySelector(
                  '[name="phone"]',
            ) as HTMLInputElement;
            if (input) input.value = value;
      }
}
