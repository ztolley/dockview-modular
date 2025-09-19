import type {
  IContentRenderer,
  GroupPanelPartInitParameters,
} from "dockview-core";

/** Simple built-in panel used to verify the host application wiring. */
export class InternalPanel implements IContentRenderer {
  private readonly _element: HTMLElement;

  get element(): HTMLElement {
    return this._element;
  }

  constructor() {
    this._element = document.createElement("div");
  }

  init(parameters: GroupPanelPartInitParameters): void {
    void parameters;
    this._element.innerText =
      "This is a panel included in the core application";
  }
}
