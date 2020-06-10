import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastService } from '@app/services/toast.service';
import { ChatService } from '@app/services/chat.service';
import { environment } from '@env';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-communications-list',
  templateUrl: './communications-list.component.html',
  styleUrls: ['./communications-list.component.sass']
})
export class CommunicationsListComponent implements OnInit {
  fakeJSON = `{
    "communications": [
      {
        "title": "Conversa 01",
        "date": "28/05",
        "from": "Leonardo Airam Vieira",
        "to": "Carlos Xavier",
        "chatId": 80040
      },
      {
        "title": "Conversa 02",
        "date": "28/05",
        "from": "Leonardo Airam Vieira",
        "to": "Carlos Xavier",
        "chatId": 80040
      },
      {
        "title": "Conversa 03",
        "date": "28/05",
        "from": "Leonardo Airam Vieira",
        "to": "Carlos Xavier",
        "chatId": 80040
      },
      {
        "title": "Conversa 04",
        "date": "28/05",
        "from": "Leonardo Airam Vieira",
        "to": "Carlos Xavier",
        "chatId": 80040
      },
      {
        "title": "Conversa 05",
        "date": "28/05",
        "from": "Leonardo Airam Vieira",
        "to": "Carlos Xavier",
        "chatId": 80040
      }
    ]
  }`;

  title = '';

  communications = [];

  isLoading = false;
  selectedIndex: number = null;

  constructor(
    private dialog: MatDialogRef<CommunicationsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toast: ToastService,
    private chatService: ChatService
  ) {
    this.title = data.title;
  }

  ngOnInit() {
    this.communications = JSON.parse(this.fakeJSON).communications;
  }

  openChat(chatId, index) {
    this.isLoading = true;
    this.selectedIndex = index;

    this.chatService
      .getContactFromByChatId(chatId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: any) => {
        if (response.status === 'success') {
          window.open(
            `${environment.communicationAppUrl}/chat?chat_log=${chatId}&contact_log=${response.record.contactFrom.id}`,
            '_blank'
          );
        } else {
          this.toast.show(response.message, 'warning');
        }
      });
  }

  close() {
    this.dialog.close();
  }
}
