import { LitElement, html, css } from 'lit';
import { registerSW } from 'virtual:pwa-register'
import '@dile/dile-toast-persistent/dile-toast-persistent';

export class FctPwa extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                --dile-toast-persistent-padding: 1rem;
                --dile-toast-persistent-background-color: var(--primary-dark-color);
            }

            p {
                margin: 0 0 10px;
            }
            
            @media(min-width: 400px) {
                :host {
                    --dile-toast-persistent-width: 360px;
                    --dile-toast-persistent-max-width: 360px;
                }   
            }
            
        `
    ];

    constructor() {
        super();
    }

    firstUpdated() {
        super.firstUpdated();
        this.updatedmessage = this.shadowRoot.getElementById('updatedmessage');
        this.initPwa();
    }

    render() {
        return html`
            <dile-toast-persistent id="updatedmessage">
                <p>
                    Update! there is a new version of this game...
                </p>
                <c4-button @click=${this.refreshApp}>Update</c4-button>
                <c4-button @click=${this.closeUpdatedToast}>Forget</c4-button>
            </dile-toast-persistent>
        `;
    }
    
    initPwa() {
        this.refreshSW = registerSW({
            inmediate: true,
            onNeedRefresh: () => {
                this.updatedmessage.open();
            },
        })
    }

    closeUpdatedToast() {
        this.updatedmessage.close();
    }

    refreshApp() {
        console.log('refreshApp');
        this.refreshSW?.(true);
    }
}
customElements.define('fct-pwa', FctPwa);
