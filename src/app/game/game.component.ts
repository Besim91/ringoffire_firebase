import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from './../global-data.service';
import { Firestore, onSnapshot, doc, updateDoc, collection } from '@angular/fire/firestore';
import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { Game } from './../../models/game';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  gameId!: any;
  game: Game = new Game();
  unsubGameList: any;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private gameService: GameService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
    const gameDocRef = doc(this.getColRef(), this.gameId);
    this.unsubGameList = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data() as Game; // Assuming Game is a valid type
        this.game.currentPlayer = gameData.currentPlayer;
        this.game.playedCards = gameData.playedCards;
        this.game.player = gameData.player;
        this.game.stack = gameData.stack;
        this.game.pickCardAnimation = gameData.pickCardAnimation;
        this.game.currentCard = gameData.currentCard;
        this.game.description = gameData.description;
        this.game.title = gameData.title;
        this.gameService.setGame(this.game); // Update game service
      } else {
        console.log('Document not found');
      }
    });
  }

  getColRef(): any {
    return collection(this.firestore, 'games');
  }

  takeCard(): void {
    if (!this.game.pickCardAnimation) {
      let card = this.game.stack.pop();
      if (card !== undefined) {
        this.game.currentCard = card;
        this.gameService.setGame(this.game); // Update game service
      }
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        const gameDocRef = doc(this.getColRef(), this.gameId);
        updateDoc(gameDocRef, {
          playedCards: this.game.playedCards,
          currentPlayer: this.game.currentPlayer,
          stack: this.game.stack,
          title: this.game.title,
          description: this.game.description
        }).then(() => {
          console.log('Game state updated');
        }).catch((error) => {
          console.error('Error updating game state:', error);
        });
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.player.push(name);
        this.gameService.setGame(this.game); // Update game service
        const gameDocRef = doc(this.getColRef(), this.gameId);
        updateDoc(gameDocRef, {
          player: this.game.player
        }).then(() => {
          console.log('New player added:', name);
        }).catch((error) => {
          console.error('Error updating player list:', error);
        });
      }
    });
  }
}
