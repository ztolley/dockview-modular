class GreetingPanel {
  constructor() {
    this.elementRef = document.createElement("div");
    this.elementRef.classList.add("greeting-panel");
  }

  get element() {
    return this.elementRef;
  }

  init(parameters) {
    const title = parameters?.params?.title ?? "Guest";
    this.elementRef.textContent = `Greetings, ${title}!`;
  }
}

export { GreetingPanel };
