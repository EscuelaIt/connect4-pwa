import { LitElement, html, css } from 'lit';

export class C4Message extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                min-height: 1.5rem;
                align-items: center;
            }
        `
    ];

    static get properties() {
      return {
        message: { type: String }
      };
    }

    constructor() {
        super();
        this.message = '';
        window.addEventListener('new-message', e => {
            this.message = e.detail.message
        });
        window.addEventListener('append-message', e => {
            this.message += " " + e.detail.message
        });
    }

    render() {
        return html`${this.message}`;
    }
}
customElements.define('c4-message', C4Message);
