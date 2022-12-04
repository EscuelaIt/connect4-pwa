import { LitElement, html, css } from 'lit';
import { Coordinate } from '../types/Coordinate.js';
import './c4-token';
import { Message } from '../views/Message.js';

export class C4Board extends LitElement {
    static styles = [
        css`
            :host {
                max-width: 460px;
                margin: 1rem;
                display: grid;
                grid-template-columns: repeat(${Coordinate.NUMBER_COLUMNS}, auto);
                column-gap: 0.4rem;
                row-gap: 0.6rem;
            }
            @media(min-width: 380px) {
                :host {
                    column-gap: 0.7rem;
                    row-gap: 0.7rem;
                    
                }
            }
        `
    ];

    static get properties() {
      return {
        game: { type: Object },
        boardColors: { type: Array },
      };
    }

    constructor() {
        super();
        this.boardColors = [];
    }

    render() {
        return html`
            ${this.boardColors.map( (color, index) => html`
                <c4-token 
                    color="${color}"
                    index="${index}"
                    @token-selected=${this.doTokenSelected}
                >${color}</c4-token>
            `)}
        `;
    }

    updateBoard() {
        let boardColors = [];
        for (let i = Coordinate.NUMBER_ROWS - 1; i >= 0; i--) {
            for (let j = 0; j < Coordinate.NUMBER_COLUMNS; j++) {
                let color = this.game.getColor(new Coordinate(i, j)).toString()[0];
                boardColors.push(color);
            }
        }
        this.boardColors = boardColors;
    }

    doTokenSelected(e) {
        let column = this.getColumnIndex(e.detail.index);
        let valid = Coordinate.isColumnValid(column);
        if(!valid) {
            Message.INVALID_COLUMN.write();
        } else {
            valid = ! this.game.getActivePlayer().isComplete(column);
            if(!valid) {
                Message.COMPLETED_COLUMN.write();
            }
        }
        if(valid) {
            this.dispatchEvent(new CustomEvent('column-selected', { 
                detail: { index: column }
            }));
        }
    }

    getColumnIndex(tokenIndex) {
        return tokenIndex % Coordinate.NUMBER_COLUMNS;
    }
}

customElements.define('c4-board', C4Board);
