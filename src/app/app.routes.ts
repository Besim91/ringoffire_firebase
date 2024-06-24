import { Routes } from '@angular/router';
import { StartscreenComponent } from './startscreen/startscreen.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
    { path: '', component: StartscreenComponent },
    { path: 'game', component: GameComponent },
];
