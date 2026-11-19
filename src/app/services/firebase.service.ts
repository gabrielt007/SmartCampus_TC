import { Injectable } from '@angular/core';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  readonly firestore: Firestore;

  constructor() {
    const app =
      getApps().find((registeredApp) => registeredApp.name === '[DEFAULT]') ?? initializeApp(environment.firestore);

    this.firestore = getFirestore(app);
  }
}
