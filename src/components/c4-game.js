import { LitElement, html, css } from 'lit';
import { Game } from '../models/Game.js';
import { Message } from "../views/Message.js";
import './c4-turn';
import './c4-board';
import './c4-player-selector';
import './c4-message';
import { refreshIcon } from '@dile/icons';
import { Coordinate } from '../types/Coordinate.js';


export class C4Game extends LitElement {
    #game;
    #gameView;

    static styles = [
        css`
            :host {
                --primary-color: #09A5FF;
            }
            section {
                flex-direction: column;
                background-color: var(--primary-color);
                display: flex;
                align-items: stretch;
                width: 100%;
                min-height: 200px;
            }
            .hidden {
                display: none;
            }
            header {
                padding: 1rem;
                background-color: #31343D;
                color: #fff;
                min-width: 200px;
            }
            main {
                flex-grow: 1;
            }
            h1 { 
                font-size: 1.5rem;
                letter-spacing: 0.075em;
            }
            h1 span {
                color: #09A5FF;
            }
            nav {
                margin: 1rem 0;
            }
            footer {
                padding: 0.5rem 1rem;
                background-color: #ddd;
            }

            @media(min-width: 635px) {
                section {
                    flex-direction: row;
                }
            }
            @media(min-width: 550px) {
                :host {
                    box-shadow: 4px 4px 12px rgba(100, 100, 100, 0.5);
                    border: 8px solid #fff;
                    border-radius: 0.5rem;
                }
            }
        `
    ];

    static get properties() {
        return {
          started: { type: Boolean },
          isOnColumnInput: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.#game = new Game();
        this.started = false;
    }

    firstUpdated() {
        this.boardComponent = this.shadowRoot.querySelector('c4-board');
        this.turnComponent = this.shadowRoot.querySelector('c4-turn');
        Message.NUM_PLAYERS.write();
    }

    render() {
        return html`
            <section>
                <header>
                    <h1>Connect<span>4</span></h1>
                    <nav>
                        <c4-button white .icon=${refreshIcon} @click=${this.gameReset}>Reset game</c4-button>
                    </nav>
                    <c4-turn
                        .game=${this.#game}
                        @catch-column=${this.doCatchColumn}
                        @machine-player-column=${this.doMachineColumnSelected}
                    ></c4-turn>
                </header>
                <main>
                    <c4-board 
                        class="${this.started ? '' : 'hidden'}"
                        .game=${this.#game}
                        @column-selected=${this.doColumnSelected}
                    ></c4-board>
                    <c4-player-selector
                        class="${this.started ? 'hidden' : ''}"
                        @players-selected=${this.definePlayers}
                    ></c4-player-selector>
                </main>
            </section>
            <footer>
                <c4-message></c4-message>
            </footer>
        `;
    }

    gameReset() {
        this.started = false;
        this.turnComponent.resetTurn();
        Message.NUM_PLAYERS.write();
    }

    definePlayers(e) {
        this.started = true;
        this.#game.reset(e.detail.numPlayers);
        this.boardComponent.updateBoard();
        this.turnComponent.dropToken();
    }

    doColumnSelected(e) {
        if(this.isOnColumnInput) {
            this.putToken(e.detail.index);
        }
    }

    doMachineColumnSelected(e) {
        this.putToken(e.detail.index);
    }

    putToken(column) {
        this.#game.getActivePlayer().dropToken(column);
        this.isOnColumnInput = false;
        this.boardComponent.updateBoard();
        if(this.#game.isFinished()) {
            this.writeResults()
        } else {
            this.#game.next();
            this.turnComponent.dropToken();
        }
    }

    doCatchColumn() {
        this.isOnColumnInput = true;
    }

    writeResults() {
        if (this.#game.isWinner()) {
            let messageText = Message.PLAYER_WIN.toString();
            messageText = messageText.replace(`#color`, this.#game.getActiveColor().toString());
            let message = new Message(messageText);
            message.write();
        } else {
            Message.PLAYERS_TIED.write();
        }
    }
}
customElements.define('c4-game', C4Game);
