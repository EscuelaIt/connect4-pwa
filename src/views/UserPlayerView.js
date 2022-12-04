import { PlayerView } from './PlayerView.js';
import { Message } from './Message.js';
import { Coordinate } from '../types/Coordinate.js';

export class UserPlayerView extends PlayerView {
    #message;

    constructor(player) {
        super(player);
        this.#message = new Message('');
    }

    getColumn() {
        let column;
        let valid;
        do {
            this.#message.setMessage(this.getActivePlayer().getColor().toString() + ' player: ').write();
            Message.ENTER_COLUMN_TO_DROP.append();
            column = console.readNumber(Message.ENTER_COLUMN_TO_DROP.toString()) - 1;
            valid = Coordinate.isColumnValid(column);
            if (!valid) {
                Message.INVALID_COLUMN.writeln();
            } else {
                valid = !this.getActivePlayer().isComplete(column);
                if (!valid) {
                    Message.COMPLETED_COLUMN.writeln();
                }
            }
        } while (!valid);
        return column;
    }
     
}