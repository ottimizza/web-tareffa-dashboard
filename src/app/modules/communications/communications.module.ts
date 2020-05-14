import { NgModule } from '@angular/core';
import { CommunicationsComponent } from './page/communications.component';
import { CommonModule } from '@angular/common';
import { CommunicationsRoutingModule } from './communications.routing';

@NgModule({
  declarations: [CommunicationsComponent],
  imports: [CommonModule, CommunicationsRoutingModule]
})
export class CommunicationsModule {}
