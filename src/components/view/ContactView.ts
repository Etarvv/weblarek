import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Contacts extends Component<{ valid: boolean; errors: string }> {
      private inputs: Record<string, HTMLInputElement>;
      private submitBtn: HTMLButtonElement;
      private errorsEl: HTMLElement;

      constructor(container: HTMLElement, events: IEvents, name = "contacts") {
            super(container);
            this.inputs = {
                  email: container.querySelector('[name="email"]')!,
                  phone: container.querySelector('[name="phone"]')!,
            };
            this.submitBtn = container.querySelector(
                  'button[type="submit"], .contacts__submit',
            )! as HTMLButtonElement;
            this.errorsEl = container.querySelector(".form__errors")!;

            Object.entries(this.inputs).forEach(([field, input]) =>
                  input?.addEventListener("input", (e) =>
                        events.emit(`${name}.${field}:change`, {
                              field,
                              value: (e.target as HTMLInputElement).value,
                        }),
                  ),
            );
            this.submitBtn?.addEventListener("click", (e) => {
                  e.preventDefault();
                  events.emit(`${name}:submit`);
            });
      }

      set email(v: string) {
            this.inputs.email && (this.inputs.email.value = v);
      }
      set phone(v: string) {
            this.inputs.phone && (this.inputs.phone.value = v);
      }
      set valid(v: boolean) {
            this.submitBtn && this.setDisabled(this.submitBtn, !v);
      }
      set errors(v: string) {
            this.errorsEl && this.setText(this.errorsEl, v);
      }

      render(
            state: Partial<{
                  valid: boolean;
                  errors: string;
                  email: string;
                  phone: string;
            }>,
      ) {
            if (state.email !== undefined) this.email = state.email;
            if (state.phone !== undefined) this.phone = state.phone;
            return super.render({ valid: state.valid, errors: state.errors });
      }
}
