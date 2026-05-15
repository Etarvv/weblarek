import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
      protected submitBtn: HTMLButtonElement;
      protected errorsEl: HTMLElement;

      constructor(
            protected container: HTMLFormElement,
            protected events: IEvents,
            protected formName: string,
      ) {
            super(container);
            this.submitBtn = container.querySelector(
                  'button[type="submit"]',
            ) as HTMLButtonElement;
            this.errorsEl = container.querySelector(
                  ".form__errors",
            ) as HTMLElement;

            this.container.addEventListener("submit", (e) => {
                  e.preventDefault();
                  if (!this.submitBtn.disabled)
                        this.events.emit(`${this.formName}:submit`);
            });
      }

      protected onInputChange(field: keyof T, value: string) {
            this.events.emit(`${this.formName}.${String(field)}:change`, {
                  field,
                  value,
            });
      }

      set valid(value: boolean) {
            this.setDisabled(this.submitBtn, !value);
      }

      set errors(value: string) {
            this.setText(this.errorsEl, value);
      }

      render(
            state: Partial<T> & { valid?: boolean; errors?: string },
      ): HTMLElement {
            const { valid, errors, ...inputs } = state;
            if (valid !== undefined) this.valid = valid;
            if (errors !== undefined) this.errors = errors;
            Object.assign(this, inputs);
            return this.container;
      }
}
