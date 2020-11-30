import { SwUpdate } from '@angular/service-worker';
import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { RxEvent } from './rx-event.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  constructor(public updates: SwUpdate, public events: RxEvent) {
    if (updates.isEnabled) {
      // 10 minutos
      interval(10 * 1000).subscribe(() => updates.checkForUpdate());
    }
  }

  public checkForUpdates(): void {
    console.log('checking for updates');
    this.updates.available.subscribe(event => this.promptUser());
  }

  private promptUser(): void {
    console.log('updating to new version');
    this.updates.activateUpdate().then(() => this.events.next('sw::update', {}));
  }
}
