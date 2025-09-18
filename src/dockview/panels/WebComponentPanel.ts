import type {
  IContentRenderer,
  GroupPanelPartInitParameters,
} from "dockview-core";

export class WebComponentPanel implements IContentRenderer {
  private readonly _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  constructor(elementType: string) {
    this._element = document.createElement(elementType);
  }

  init(_parameters: GroupPanelPartInitParameters): void {}
}
