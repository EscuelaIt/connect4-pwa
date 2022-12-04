import { PlayerView } from "./PlayerView.js";

export class MachinePlayerView extends PlayerView {

    constructor(player) {
        super(player);
    }

    getColumn() {
        let column = this.getActivePlayer().getColumn();
        return column;
    }

}