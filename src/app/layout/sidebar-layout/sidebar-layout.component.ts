import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { User } from '@shared/models/User';
import { MatDialog } from '@angular/material/dialog';
import { FunctionAccessService } from '@app/services/function-access.service';
import { finalize } from 'rxjs/operators';
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

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public dialog: MatDialog,
    private functionAccess: FunctionAccessService
  ) {}

  public hide(e) {
    this.document.getElementsByTagName('body')[0].classList.remove('show-sidebar');
  }

  ngOnInit() {
    this.currentUser = User.fromLocalStorage();

    this.verifyPermission().then(result => {
      this.items = [
        { icon: 'fad fa-chart-pie', label: 'Padrão', url: '/dashboard/default' },
        { icon: 'fad fa-analytics', label: 'Analítico', url: '/dashboard/analytics' }
      ];
      if (result) {
        this.items.push({
          icon: 'fad fa-edit',
          label: 'Parametrização',
          url: '/dashboard/indicators'
        });
      }
    });
  }

  verifyPermission(): Promise<any> {
    return new Promise(resolve => {
      this.functionAccess.verifyFunction('dashboard-app-update-indicators').subscribe(
        response => {
          resolve(true);
        },
        err => {
          resolve(false);
        }
      );
    });
  }

  // public openSiginAsModal() {
  //   const dialogRef = this.dialog.open(SigninAsDialogComponent, {
  //     width: '568px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
}
