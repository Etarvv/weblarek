import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardData extends IProduct {
      index?: number;
}

export abstract class BaseCard extends Component<ICardData> {
      protected titleEl: HTMLElement;
      protected priceEl: HTMLElement;
      protected imageEl?: HTMLImageElement;
      protected categoryEl?: HTMLElement;
      protected descriptionEl?: HTMLElement;
      protected buttonEl?: HTMLButtonElement;

      constructor(container: HTMLElement) {
            super(container);
            this.titleEl = ensureElement(".card__title", container);
            this.priceEl = ensureElement(".card__price", container);
            this.imageEl = container.querySelector(
                  ".card__image",
            ) as HTMLImageElement;
            this.categoryEl = container.querySelector(
                  ".card__category",
            ) as HTMLElement;
            this.descriptionEl = container.querySelector(
                  ".card__text",
            ) as HTMLElement;
            this.buttonEl = container.querySelector(
                  ".card__button",
            ) as HTMLButtonElement;
      }

      set title(value: string) {
            this.setText(this.titleEl, value);
      }

      set price(value: number | null) {
            const priceText = value === null ? "Бесценно" : `${value} синапсов`;
            this.setText(this.priceEl, priceText);
      }

      set image(value: string) {
            if (this.imageEl) {
                  this.setImage(
                        this.imageEl,
                        value,
                        this.titleEl.textContent ?? "Товар",
                  );
            }
      }

      set category(value: string) {
            if (this.categoryEl) this.setText(this.categoryEl, value);
      }

      set description(value: string) {
            if (this.descriptionEl) this.setText(this.descriptionEl, value);
      }

      set buttonText(value: string) {
            if (this.buttonEl) this.setText(this.buttonEl, value);
      }

      set buttonDisabled(value: boolean) {
            if (this.buttonEl) this.setDisabled(this.buttonEl, value);
      }
}

export class CatalogCard extends BaseCard {
      constructor(container: HTMLElement, onClick: () => void) {
            super(container);
            this.container.addEventListener("click", onClick);
      }
}

export class PreviewCard extends BaseCard {
      constructor(container: HTMLElement, onAddToCart: () => void) {
            super(container);
            if (this.buttonEl)
                  this.buttonEl.addEventListener("click", onAddToCart);
      }
}

export class BasketCard extends BaseCard {
      protected indexEl: HTMLElement;
      protected removeBtn: HTMLButtonElement;

      constructor(container: HTMLElement, onRemove: () => void) {
            super(container);
            this.indexEl = ensureElement(".basket__item-index", container);
            this.removeBtn = ensureElement(
                  ".card__button",
                  container,
            ) as HTMLButtonElement;
            this.removeBtn.addEventListener("click", onRemove);
      }

      set index(value: number) {
            this.setText(this.indexEl, String(value));
      }
}
