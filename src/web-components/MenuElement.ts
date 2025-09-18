import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("ztdm-menu")
export class MenuElement extends LitElement {
  render() {
    return html`<div class="menu">
      <select>
        <option value="one">One</option>
        <option value="two">Two</option>
        <option value="three">Three</option>
      </select>
    </div>`;
  }

  static styles = css`
    :host {
      display: flex;
      font-size: 1.5em;
    }

    .menu {
      margin-right: 0.5rem;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ztdm-menu": MenuElement;
  }
}
