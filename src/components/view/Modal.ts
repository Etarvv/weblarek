import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<{ content: HTMLElement }> {
      protected closeButton: HTMLButtonElement;
      protected _content: HTMLElement;
      protected container: HTMLElement;

      constructor(container: HTMLElement) {
            super(container);
            this.container = container;
            this.closeButton = ensureElement(
                  ".modal__close",
                  container,
            ) as HTMLButtonElement;
            this._content = ensureElement(".modal__content", container);
            this.closeButton.addEventListener("click", this.close.bind(this));
            this.container.addEventListener("click", this.close.bind(this));
            this._content.addEventListener("click", (e) => e.stopPropagation());
      }

      set content(value: HTMLElement) {
            this._content.innerHTML = "";
            this._content.appendChild(value);
      }

      open(): void {
            this.container.classList.add("modal_active");
      }

      close(): void {
            this._content.innerHTML = "";
            this.container.classList.remove("modal_active");
      }

      render(data: { content: HTMLElement }): HTMLElement {
            this.open();
            this.content = data.content;
            return this.container;
      }
}
