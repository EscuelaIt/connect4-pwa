import { LitElement, html, css } from 'lit';
import { Message } from '../views/Message.js';

export class C4Turn extends LitElement {
    #message;

    static styles = [
        css`
            :host {
                display: block;
                margin-top: 1.2rem;
            }
            .player {
                display: flex;
                flex-direction: row;
                margin: 0.75rem;
                align-items: center;
                opacity: 0.4;
            }
            c4-token {
                margin-right: 1rem;
            }
            .active {
                opacity: 1;
            }
        `
    ];

    static get properties() {
        return {
          game: { type: Object },
          activePlayerColor: { type: String},
        };
    }

    constructor() {
        super();
        this.#message = new Message('');
    }  

    render() {
        return html`
            <article class="player ${this.activePlayerColor == "Red" ? 'active' : ''}">
                <c4-token color="R"></c4-token>
                <span>Player red</span>
            </article>
            <article class="player ${this.activePlayerColor == "Yellow" ? 'active' : ''}">
                <c4-token color="Y"></c4-token>
                <span>Player Yellow</span>
            </article>
        `;
    }

    
    dropToken() {
        let activePlayer = this.game.getActivePlayer();
        this.activePlayerColor = activePlayer.getColor();
        activePlayer.accept(this);
    }

    visitUserPlayer(userPlayer) {
        this.#message.setMessage(userPlayer.getColor().toString() + ' player: ').write();
        Message.ENTER_COLUMN_TO_DROP.append();
        this.dispatchEvent(new CustomEvent('catch-column'));
    }

    visitMachinePlayer(machinePlayer) {
        setTimeout( () => {
            this.dispatchEvent(new CustomEvent('machine-player-column', {
                bubbles: true,
                composed: true,
                detail: { index: machinePlayer.getColumn() }
            }));
        }, 400)
    }

    resetTurn() {
        this.activePlayerColor = undefined;
    }
}
customElements.define('c4-turn', C4Turn);
