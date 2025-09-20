import type {
  GroupPanelPartInitParameters,
  IContentRenderer,
} from "dockview-core";

/** Example third-party panel that greets the user. */
export class GreetingPanel implements IContentRenderer {
  private readonly elementRef: HTMLElement;

  constructor() {
    this.elementRef = document.createElement("div");
    this.elementRef.classList.add("greeting-panel");
  }

  get element(): HTMLElement {
    return this.elementRef;
  }

  init(parameters: GroupPanelPartInitParameters): void {
    const title = parameters.params?.title ?? "Guest";
    this.elementRef.textContent = `Greetings, ${title}, nice to meet you!`;
  }
}
