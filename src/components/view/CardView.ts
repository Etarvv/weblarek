import { IProduct } from "../../types";
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type CardType = "catalog" | "preview" | "basket";

export interface ICardOptions {
      type: CardType;
      onClick?: (event: MouseEvent) => void;
      onRemove?: (event: MouseEvent) => void;
}

export interface ICardViewData extends IProduct {
      index?: number;
}

export class CardView extends Component<ICardViewData> {
      protected _titleElement: HTMLElement;
      protected _priceElement: HTMLElement;

      protected _imageElement?: HTMLImageElement;
      protected _categoryElement?: HTMLElement;
      protected _textElement?: HTMLElement;

      protected _indexElement?: HTMLElement;
      protected _removeBtn?: HTMLButtonElement;
      protected _actionBtn?: HTMLButtonElement;

      protected readonly type: CardType;
      private currentCategoryModifier?: string;

      constructor(container: HTMLElement, options: ICardOptions) {
            super(container);
            this.type = options.type;

            this._titleElement = ensureElement(".card__title", container);
            this._priceElement = ensureElement(".card__price", container);

            switch (this.type) {
                  case "catalog":
                        this._imageElement = ensureElement(
                              ".card__image",
                              container,
                        ) as HTMLImageElement;
                        this._categoryElement = ensureElement(
                              ".card__category",
                              container,
                        );
                        if (options.onClick) {
                              container.addEventListener(
                                    "click",
                                    options.onClick,
                              );
                        }
                        break;

                  case "preview":
                        this._imageElement = ensureElement(
                              ".card__image",
                              container,
                        ) as HTMLImageElement;
                        this._categoryElement = ensureElement(
                              ".card__category",
                              container,
                        );
                        this._textElement = ensureElement(
                              ".card__text",
                              container,
                        );
                        this._actionBtn = ensureElement(
                              ".card__button",
                              container,
                        ) as HTMLButtonElement;
                        if (options.onClick) {
                              this._actionBtn.addEventListener(
                                    "click",
                                    options.onClick,
                              );
                        }
                        break;

                  case "basket":
                        this._indexElement = ensureElement(
                              ".basket__item-index",
                              container,
                        );
                        this._removeBtn = ensureElement(
                              ".card__button",
                              container,
                        ) as HTMLButtonElement;
                        if (options.onRemove) {
                              this._removeBtn.addEventListener(
                                    "click",
                                    options.onRemove,
                              );
                        }
                        break;
            }
      }

      // --- Сеттеры ---
      set title(value: string) {
            this.setText(this._titleElement, value);
      }

      set price(value: number | null) {
            const priceText = value === null ? "Бесценно" : `${value} синапсов`;
            this.setText(this._priceElement, priceText);

            if (this.type === "preview" && this._actionBtn) {
                  if (value === null) {
                        this.setDisabled(this._actionBtn, true);
                        this.setText(this._actionBtn, "Недоступно");
                  } else {
                        this.setDisabled(this._actionBtn, false);
                        this.setText(this._actionBtn, "В корзину");
                  }
            }
      }

      set image(value: string) {
            if (this._imageElement) {
                  const alt = this._titleElement?.textContent ?? "Товар";
                  this.setImage(this._imageElement, value, alt);
            }
      }

      set category(value: string) {
            if (this._categoryElement) {
                  this.setText(this._categoryElement, value);
                  const newModifier =
                        categoryMap[value as keyof typeof categoryMap];

                  if (this.currentCategoryModifier) {
                        this.toggleClass(
                              this._categoryElement,
                              this.currentCategoryModifier,
                              false,
                        );
                  }
                  if (newModifier) {
                        this.toggleClass(
                              this._categoryElement,
                              newModifier,
                              true,
                        );
                        this.currentCategoryModifier = newModifier;
                  } else {
                        this.currentCategoryModifier = undefined;
                  }
            }
      }

      set text(value: string) {
            if (this._textElement) {
                  this.setText(this._textElement, value);
            }
      }

      set index(value: number) {
            if (this._indexElement) {
                  this.setText(this._indexElement, String(value));
            }
      }

      set buttonText(value: string) {
            if (this._actionBtn) {
                  this.setText(this._actionBtn, value);
            }
            if (this._removeBtn && this.type === "basket") {
                  this.setText(this._removeBtn, value);
            }
      }

      set buttonDisabled(value: boolean) {
            if (this._actionBtn) {
                  this.setDisabled(this._actionBtn, value);
            }
      }

      render(data?: Partial<ICardViewData>): HTMLElement {
            super.render(data);
            return this.container;
      }
}
