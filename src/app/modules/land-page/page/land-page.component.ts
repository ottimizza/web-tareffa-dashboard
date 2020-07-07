import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { User } from '@shared/models/User';

@Component({
  selector: 'app-land-page',
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.scss']
})
export class LandPageComponent implements OnInit {
  currentUser: User;

  supportNumber = '+5547999455447';
  defaultMessage = ['Estou', 'com', 'dificuldades', 'de', 'acesso', 'ao', 'Tareffa!'];

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.currentUser = User.fromLocalStorage();
  }

  authenticate() {
    this.authenticationService.authorize();
  }

  openWppWeb() {
    window.open(
      `https://web.whatsapp.com/send?phone=${this.supportNumber}&text=${this.defaultMessage.join(
        '+'
      )}`,
      '_blank'
    );
  }
}
