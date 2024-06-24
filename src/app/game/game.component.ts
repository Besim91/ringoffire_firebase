import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from './../../models/game';
import { PlayerComponent } from './../player/player.component';
import { MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent} from './../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent} from './../game-info/game-info.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule, 
    PlayerComponent,
    MatButtonModule,
    GameInfoComponent,
    MatIconModule
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game!: Game;
  currentCard: string = '';  

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();

    this.firestore.
    collection('games').
    valueChanges().
    subscribe((game)=>{
      console.log(game);
    });
    
  }

  takeCard() {
    if (!this.pickCardAnimation) {  
      let card = this.game.stack.pop();

      if (card !== undefined) {  
        this.currentCard = card;
      }
    }
    this.pickCardAnimation = true;


    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  newGame() {
    this.game = new Game();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.player.push(name);
      }
    });
  }
}
