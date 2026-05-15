import { Component } from "../base/Component";

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
      constructor(container: HTMLElement) {
            super(container);
      }
      set catalog(items: HTMLElement[]) {
            this.container.replaceChildren(...items);
      }
}
