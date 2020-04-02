import { Component, OnInit, Inject } from '@angular/core';
import { RxEvent } from '@app/services/rx-event.service';
import { DOCUMENT } from '@angular/common';
import { UpdateService } from '@app/services/update.service';
import { MessagingService } from '@app/services/messaging.service';
import { LoggerUtils } from '@shared/utils/logger.utils';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public updateAvailable = false;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private events: RxEvent,
    private updateService: UpdateService,
    private messagingService: MessagingService
  ) {
    this.updateService.checkForUpdates();
    this.events.subscribe('sw::update', () => {
      this.updateAvailable = true;
    });
  }

  public subscribeToSidebarToggleEvents() {
    this.events.subscribe('sidebar::toggle', () => {
      const body = this.document.getElementsByTagName('body')[0];

      body.classList.toggle('show-sidebar');
    });
  }

  refresh() {
    window.location.reload();
  }

  public ngOnInit() {
    // this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();
    // this.messagingService.currentMessage.subscribe(msg => LoggerUtils.log(msg));
  }

}
