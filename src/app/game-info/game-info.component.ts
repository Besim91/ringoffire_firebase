import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Game } from './../../models/game';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent implements OnInit, OnChanges {

  game: Game = new Game();

  cardAction = [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ' },
    { title: 'Chicks', description: 'All girls drink.' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate. Your mate must always drink when you drink and the other way around.' },
    { title: 'Thumbmaster', description: '' },
    { title: 'Men', description: 'All men drink.' },
    { title: 'Quizmaster', description: '' },
    { title: 'Never have i ever...', description: 'Say something you nnever did. Everyone who did it has to drink.' },
    { title: 'Rule', description: 'Make a rule. Everyone needs to drink when he breaks the rule.' },
  ];


  @Input() card!: string;


  constructor(){}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.card) {
      let pickedCard = +this.card.split("_")[1];
      this.game.title = this.cardAction[pickedCard - 1].title;
      console.log('Karte Titel:' + this.game.title);
      this.game.description = this.cardAction[pickedCard - 1].description;
      console.log('Karte Description:' + this.game.description);
    }
  }
}
