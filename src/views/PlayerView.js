export class PlayerView {
    
    #player;

    constructor(player, turnComponent) {
        this.#player = player;
    }

    dropToken() {
        this.#player.dropToken(this.getColumn());
    }

    getColumn() {}

    getActivePlayer() {
        return this.#player;
    }

    
}