import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationsListComponent } from './communications-list.component';

@NgModule({
  declarations: [CommunicationsListComponent],
  imports: [CommonModule],
  exports: [CommunicationsListComponent],
  entryComponents: [CommunicationsListComponent]
})
export class CommunicationsListModule {}
