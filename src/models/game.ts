export class Game {
    public player: string[] = [];
    public stack: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.stack.push("clubs_" + i);
            this.stack.push("diamonds_" + i);
            this.stack.push("hearts_" + i);
            this.stack.push("spade_" + i);
        }

        this.shuffleStack();
    }


    gameAsJson(){
        return {
            player: this.player,
            stack: this.stack,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer
        }
    }

    private shuffleStack() {
        for (let i = this.stack.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.stack[i], this.stack[j]] = [this.stack[j], this.stack[i]];
        }
    }
}


