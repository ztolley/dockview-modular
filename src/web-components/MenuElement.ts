import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { addPanelByName } from "@/dockview";
import {
  getPanels,
  onPanelsChanged,
  type PanelInfo,
} from "@/dockview/panelRegistry";

@customElement("ztdm-menu")
export class MenuElement extends LitElement {
  /** Panels currently exposed by the registry. */
  @state()
  private panels: PanelInfo[] = getPanels();

  private unsubscribePanels: (() => void) | undefined;

  /** Subscribes to panel changes once the element is connected. */
  connectedCallback(): void {
    super.connectedCallback();
    this.unsubscribePanels = onPanelsChanged((panels) => {
      this.panels = panels;
    });
  }

  /** Cleans up the subscription when the element is detached. */
  disconnectedCallback(): void {
    this.unsubscribePanels?.();
    this.unsubscribePanels = undefined;
    super.disconnectedCallback();
  }

  /** Adds the panel chosen by the user. */
  private handleAddPanel(name: string): void {
    addPanelByName(name);
  }

  render() {
    return html`<div class="menu">
      <span class="menu__label">Panels</span>
      <ul>
        ${this.panels.map(
          (panel) =>
            html`<li>
              <button
                type="button"
                @click=${() => this.handleAddPanel(panel.name)}
              >
                ${panel.title}
              </button>
            </li>`,
        )}
      </ul>
    </div>`;
  }

  static styles = css`
    :host {
      display: flex;
      font-size: 1.5em;
    }

    .menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-right: 0.5rem;
    }

    .menu__label {
      font-weight: 600;
      font-size: 0.75em;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      opacity: 0.7;
    }

    ul {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    button {
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      font: inherit;
      transition: background 0.2s ease;
    }

    button:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ztdm-menu": MenuElement;
  }
}
