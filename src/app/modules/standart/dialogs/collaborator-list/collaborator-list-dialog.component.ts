import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScheduledService } from '@app/http/scheduled.service';

@Component({
  templateUrl: './collaborator-list-dialog.component.html'
})
export class CollaboratorListDialogComponent implements OnInit {
  PORTRAIT_PLACEHOLDER = './assets/images/Portrait_Placeholder.png';

  constructor(
    public scheduledService: ScheduledService,
    public dialogRef: MatDialogRef<CollaboratorListDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      records: {
        codigoErpEmpresa: string;
        dataTermino: string;
        fotoResponsavel: string;
        nomeResponsavel: string;
        razaoSocialEmpresa: string;
        servicoProgramadoId: number;
      }[];
    }
  ) {}

  ngOnInit() {
    // for (let i = 0; i < 5; i++) {
    //   this.data.push({
    //     codigoErpEmpresa: '3123',
    //     dataTermino: '22-22-2222',
    //     fotoResponsavel: 'https://i.picsum.photos/id/829/200/200.jpg';
    //   })
    // }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
