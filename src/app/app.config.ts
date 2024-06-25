import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; //Test
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; //Test

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(), 
    provideAnimationsAsync(), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAFdr-GO6QG9_PTy0lA-PHD8EDd1MwaE5M",
      authDomain: "ring-of-fire-198f5.firebaseapp.com",
      projectId: "ring-of-fire-198f5",
      storageBucket: "ring-of-fire-198f5.appspot.com",
      messagingSenderId: "44074694635",
      appId: "1:44074694635:web:8061c61a4c57d2edd84bae"
    })), //Test
    provideFirestore(() => getFirestore())] //Test
};
