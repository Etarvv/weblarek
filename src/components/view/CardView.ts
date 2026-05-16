import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";

export interface ICardData extends IProduct {
      index?: number;
      buttonText?: string;
      buttonDisabled?: boolean;
}

export abstract class BaseCard extends Component<ICardData> {
      protected titleEl: HTMLElement;
      protected priceEl: HTMLElement;

      constructor(container: HTMLElement) {
            super(container);
            this.titleEl = ensureElement(".card__title", container);
            this.priceEl = ensureElement(".card__price", container);
      }

      set id(value: string) {
            this.container.dataset.id = value;
      }

      set title(value: string) {
            this.setText(this.titleEl, value);
      }

      set price(value: number | null) {
            this.setText(
                  this.priceEl,
                  value === null ? "Бесценно" : `${value} синапсов`,
            );
      }
}

export class CatalogCard extends BaseCard {
      protected imageEl: HTMLImageElement;
      protected categoryEl: HTMLElement;

      constructor(
            container: HTMLElement,
            protected events: IEvents,
      ) {
            super(container);

            this.imageEl = ensureElement(
                  ".card__image",
                  container,
            ) as HTMLImageElement;

            this.categoryEl = ensureElement(".card__category", container);

            this.container.addEventListener("click", () => {
                  this.events.emit("product:select", {
                        id: this.container.dataset.id,
                  });
            });
      }

      set image(value: string) {
            this.setImage(
                  this.imageEl,
                  value,
                  this.titleEl.textContent ?? "Товар",
            );
      }

      set category(value: string) {
            this.setText(this.categoryEl, value);
            Object.values(categoryMap).forEach((className) => {
                  this.categoryEl.classList.remove(className);
            });
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                  this.categoryEl.classList.add(modifier);
            }
      }
}

export class PreviewCard extends BaseCard {
      protected imageEl: HTMLImageElement;
      protected categoryEl: HTMLElement;
      protected descriptionEl: HTMLElement;
      protected buttonEl: HTMLButtonElement;

      constructor(
            container: HTMLElement,
            protected events: IEvents,
      ) {
            super(container);

            this.imageEl = ensureElement(
                  ".card__image",
                  container,
            ) as HTMLImageElement;

            this.categoryEl = ensureElement(".card__category", container);

            this.descriptionEl = ensureElement(".card__text", container);

            this.buttonEl = ensureElement(
                  ".card__button",
                  container,
            ) as HTMLButtonElement;

            this.buttonEl.addEventListener("click", () => {
                  this.events.emit("preview:button-click");
            });
      }

      set image(value: string) {
            this.setImage(
                  this.imageEl,
                  value,
                  this.titleEl.textContent ?? "Товар",
            );
      }

      set category(value: string) {
            this.setText(this.categoryEl, value);
            Object.values(categoryMap).forEach((className) => {
                  this.categoryEl.classList.remove(className);
            });
            const modifier = categoryMap[value as keyof typeof categoryMap];
            if (modifier) {
                  this.categoryEl.classList.add(modifier);
            }
      }

      set description(value: string) {
            this.setText(this.descriptionEl, value);
      }

      set buttonText(value: string) {
            this.setText(this.buttonEl, value);
      }

      set buttonDisabled(value: boolean) {
            this.setDisabled(this.buttonEl, value);
      }
}

export class BasketCard extends BaseCard {
      protected indexEl: HTMLElement;
      protected removeBtn: HTMLButtonElement;

      constructor(
            container: HTMLElement,
            protected events: IEvents,
      ) {
            super(container);

            this.indexEl = ensureElement(".basket__item-index", container);

            this.removeBtn = ensureElement(
                  ".card__button",
                  container,
            ) as HTMLButtonElement;

            this.removeBtn.addEventListener("click", () => {
                  this.events.emit("basket:item-remove", {
                        id: container.dataset.id,
                  });
            });
      }

      set index(value: number) {
            this.setText(this.indexEl, String(value));
      }
}
