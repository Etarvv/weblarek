import { Component } from "../base/Component";

interface ISucces {
      total: number;
}

interface ISuccesActions {
      onClick: () => void;
}

export class SuccesInfo extends Component<ISucces> {
      protected close: HTMLElement;
      protected _total: HTMLElement;

      constructor(container: HTMLElement, actions: ISuccesActions) {
            super(container);
            this.close = container.querySelector(
                  ".order-success__close",
            ) as HTMLElement;
            this._total = container.querySelector(
                  ".order-success__description",
            ) as HTMLElement;
            if (actions?.onClick) {
                  this.close.addEventListener("click", actions.onClick);
            }
      }

      set total(value: number) {
            this.setText(this._total, `Списано ${value} синапсов`);
      }
}
