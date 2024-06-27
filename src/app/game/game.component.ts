import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './../player/player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from './../game-info/game-info.component';
import { onSnapshot, doc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Game } from './../../models/game';
import { GameService } from '../gameservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [
    PlayerComponent,
    GameInfoComponent,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
})
export class GameComponent implements OnInit, OnDestroy {
  gameId!: any;
  unsubGameList: any;
  showAddPlayerPopup = false;
  route = inject(ActivatedRoute);
  router = inject(Router);
  gameservice = inject(GameService);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('gameId');
      if (this.gameId) {
        this.loadGame();
      } else {
        console.error('Game ID is null or undefined');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unsubGameList) {
      this.unsubGameList.unsubscribe();
    }
  }

  loadGame(): void {
    const gameDocRef = doc(this.gameservice.getColRef(), this.gameId);
    this.unsubGameList = onSnapshot(gameDocRef, (element) => {
      if (element.exists()) {
        const gameData = element.data() as Game; // Assuming Game is a valid type
        this.gameservice.game.currentPlayer = gameData.currentPlayer;
        this.gameservice.game.playedCards = gameData.playedCards;
        this.gameservice.game.player = gameData.player;
        this.gameservice.game.stack = gameData.stack;
        this.gameservice.game.pickCardAnimation = gameData.pickCardAnimation;
        this.gameservice.game.currentCard = gameData.currentCard;
        this.gameservice.game.description = gameData.description;
        this.gameservice.game.title = gameData.title;
      }
    });
  }

  takeCard(): void {
    if (this.gameservice.game.player.length !== 0) {
      if (!this.gameservice.game.pickCardAnimation) {
        let card = this.gameservice.game.stack.pop();
        if (card !== undefined) {
          this.gameservice.game.currentCard = card;
        }
        this.gameservice.game.pickCardAnimation = true;

        this.gameservice.game.currentPlayer++;
        this.gameservice.game.currentPlayer =
          this.gameservice.game.currentPlayer %
          this.gameservice.game.player.length;

        setTimeout(() => {
          this.gameservice.game.playedCards.push(
            this.gameservice.game.currentCard
          );
          this.gameservice.game.pickCardAnimation = false;
          const gameDocRef = doc(this.gameservice.getColRef(), this.gameId);
          updateDoc(gameDocRef, {
            playedCards: this.gameservice.game.playedCards,
            currentPlayer: this.gameservice.game.currentPlayer,
            stack: this.gameservice.game.stack,
            title: this.gameservice.game.title,
            description: this.gameservice.game.description,
          });
        }, 1000);
      }
    } else {
      console.log('Spieler hinzufügen');
      this.showAddPlayerPopup = true;
      setTimeout(() => {
        this.showAddPlayerPopup = false;
      }, 2000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.gameservice.game.player.push(name);
        this.gameservice.setGame(this.gameservice.game); // Update game service
        const gameDocRef = doc(this.gameservice.getColRef(), this.gameId);
        updateDoc(gameDocRef, {
          player: this.gameservice.game.player,
        });
      }
    });
  }
}
