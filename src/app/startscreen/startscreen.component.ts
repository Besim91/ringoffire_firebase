import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { GameComponent } from './../game/game.component';
import { Game } from './../../models/game';



@Component({
  selector: 'app-startscreen',
  standalone: true,
  imports: [GameComponent],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss'
})

export class StartscreenComponent {
  firestore: Firestore = inject(Firestore);

  constructor(private route: ActivatedRoute, private router: Router){}

  newGame(){
    let game = new Game();
    addDoc(this.getColRef(), game.gameAsJson())
      .then((docRef) => {
        this.router.navigate(['/game', docRef.id]);
        console.log(docRef.id)
      })

  }

  getColRef(){
    return collection(this.firestore, 'games');
  }
}
