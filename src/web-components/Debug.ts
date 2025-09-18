import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("ztdm-debug")
export class DebugElement extends LitElement {
  @state()
  private counter = 0;

  render() {
    return html` <div class="wrapper">
      <h2>Debug Panel</h2>
      <p>This is a simple debug panel implemented as a web component.</p>
      <button @click=${() => this.counter++}>Click me</button>
      <p>Button clicked ${this.counter} times.</p>
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .wrapper {
      margin: 2rem;

      > * {
        margin: 1rem;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ztdm-debug": DebugElement;
  }
}
