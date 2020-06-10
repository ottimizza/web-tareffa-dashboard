import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getContactFromByChatId(chatId: string) {
    const url = `${environment.ottimizzaAPIComunicacaoURL}/services/chats/${chatId}`;
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get(url, { headers });
  }
}
