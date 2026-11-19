import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  calendarOutline,
  checkmarkCircleOutline,
  createOutline,
  homeOutline,
  peopleOutline,
  personOutline,
  phonePortraitOutline,
  playOutline,
  saveOutline,
  schoolOutline,
  speedometerOutline,
  stopOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      homeOutline,
      bookOutline,
      peopleOutline,
      phonePortraitOutline,
      schoolOutline,
      calendarOutline,
      createOutline,
      trashOutline,
      checkmarkCircleOutline,
      speedometerOutline,
      playOutline,
      stopOutline,
      personOutline,
      saveOutline,
    });
  }
}