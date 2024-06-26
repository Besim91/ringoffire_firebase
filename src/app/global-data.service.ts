import { Injectable } from '@angular/core';
import { Game } from './../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  game: Game = new Game();

  constructor() { }

  getGame(): Game {
    return this.game;
  }

  setGame(updatedGame: Game): void {
    this.game = updatedGame;
  }
}
