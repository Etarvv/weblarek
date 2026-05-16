import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

type IFormState = {
      valid: boolean;
      errors: string;
};

export abstract class Form<T> extends Component<T & IFormState> {
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

                  if (!this.submitBtn.disabled) {
                        this.events.emit(`${this.formName}:submit`);
                  }
            });
      }

      protected onInputChange(field: keyof T, value: string) {
            this.events.emit(`${this.formName}.${String(field)}:change`, {
                  value,
            });
      }

      set valid(value: boolean) {
            this.setDisabled(this.submitBtn, !value);
      }

      set errors(value: string) {
            this.setText(this.errorsEl, value);
      }

      render(state: Partial<T & IFormState>): HTMLElement {
            return super.render(state);
      }
}
