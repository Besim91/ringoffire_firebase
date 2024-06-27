import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../gameservice';
import { Game } from './../../models/game';
import { addDoc } from '@firebase/firestore';

@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss',
})
export class StartscreenComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  gameservice = inject(GameService);

  newGame() {
    this.gameservice.game = new Game();
    addDoc(
      this.gameservice.getColRef(),
      this.gameservice.game.gameAsJson()
    ).then((docRef: any) => {
      this.router.navigate(['/game', docRef.id]);
    });
    console.log(
      'Beim starten initalisiert:' + this.gameservice.game.gameAsJson()
    );
  }
}
