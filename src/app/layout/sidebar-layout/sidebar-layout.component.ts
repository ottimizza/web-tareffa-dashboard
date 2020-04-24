import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { User } from '@shared/models/User';
import { MatDialog } from '@angular/material/dialog';
// import { OverlayContainer } from '@angular/cdk/overlay';

// import { ThemeService } from '@app/service/theme.service';

export interface SidebarItem {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarLayoutComponent implements OnInit {
  public items: SidebarItem[];
  public currentUser: User;

  constructor(@Inject(DOCUMENT) public document: Document, public dialog: MatDialog) {}

  public hide(e) {
    this.document.getElementsByTagName('body')[0].classList.remove('show-sidebar');
  }

  ngOnInit() {
    this.currentUser = User.fromLocalStorage();
    this.items = [
      { icon: 'fad fa-analytics', label: 'Analítico', url: '/dashboard/analytics' },
      { icon: 'fad fa-edit', label: 'Parametrização', url: '/dashboard/indicators' }
    ];
  }

  // public openSiginAsModal() {
  //   const dialogRef = this.dialog.open(SigninAsDialogComponent, {
  //     width: '568px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
}
