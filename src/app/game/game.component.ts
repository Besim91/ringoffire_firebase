import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './../player/player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from './../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from './../game-info/game-info.component';
import { Firestore, onSnapshot, doc, updateDoc, collection } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Game } from './../../models/game';

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
export class GameComponent implements OnInit, OnDestroy {
  game: Game = new Game();
  gameId!: any;

  firestore: Firestore = inject(Firestore);
  unsubGameList: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId'); // Korrigiere dies, um 'gameId' zu verwenden
      console.log('param ID:' + this.gameId); // Prüfe, ob die gameId korrekt ausgegeben wird
      if (this.gameId) {
        this.loadGame();
      } else {
        console.error('Game ID is null or undefined');
      }
    });
  }
  
  ngOnDestroy() {
    if (this.unsubGameList) {
      this.unsubGameList();
    }
  }

  loadGame() {
    const gameDocRef = doc(this.getColRef(), this.gameId);
    this.unsubGameList = onSnapshot(gameDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data();
        console.log('Dokument gefunden:', gameData);
        this.game.currentPlayer = gameData['currentPlayer'];
        this.game.playedCards = gameData['playedCards'];
        this.game.player = gameData['player'];
        this.game.stack = gameData['stack'];
        this.game.pickCardAnimation = gameData['pickCardAnimation'];
        this.game.currentCard = gameData['currentCard'];
        this.game.description = gameData['description'];
        this.game.title = gameData['title'];
      } else {
        console.log('Dokument nicht gefunden');
      }
    });
  }

  getColRef() {
    return collection(this.firestore, 'games');
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      let card = this.game.stack.pop();
      if (card !== undefined) {
        this.game.currentCard = card;
      }
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.player.length;

      console.log('Wert für Datenbak:' + this.game.title);
      console.log('Wert für Datenbak:' + this.game.description);
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        // Das Spieldokument in Firestore aktualisieren
        const gameDocRef = doc(this.getColRef(), this.gameId);
        updateDoc(gameDocRef, {
          playedCards: this.game.playedCards,
          currentPlayer: this.game.currentPlayer,
          stack: this.game.stack,
          title: this.game.title,
          description: this.game.description
        }).then(() => {
          console.log('Spielzustand aktualisiert');
        }).catch((error) => {
          console.error('Fehler beim Aktualisieren des Spielzustands:', error);
        });
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.player.push(name);
        const gameDocRef = doc(this.getColRef(), this.gameId);
        updateDoc(gameDocRef, {
          player: this.game.player
        }).then(() => {
          console.log('Neuer Spieler hinzugefügt:', name);
        }).catch((error) => {
          console.error('Fehler beim Aktualisieren der Spielerliste:', error);
        });
      }
    });
  }
}
