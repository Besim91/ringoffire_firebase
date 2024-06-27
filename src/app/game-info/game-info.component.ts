import { Component, Input, inject, } from '@angular/core';
import { GameService } from '../gameservice'
import { Game } from './../../models/game';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
  standalone: true,
  imports: [MatCardModule]
})
export class GameInfoComponent {
  @Input() card!: string;
  gameservice = inject(GameService);

  
  ngOnChanges(): void {
    if (this.card) {
      let pickedCard = +this.card.split("_")[1];
      this.gameservice.game.title = this.gameservice.cardAction[pickedCard - 1].title;
      this.gameservice.game.description = this.gameservice.cardAction[pickedCard - 1].description;
      // this.gameservice.setGame(this.gameservice.game); 
    }
  }
}
