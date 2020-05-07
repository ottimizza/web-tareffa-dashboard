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
      body: any;
      id: number;
      dataProgramada: number;
    }
  ) {}

  records: any[] = [];
  isFetching = false;

  ngOnInit() {
    this.isFetching = true;
    this.scheduledService.getInformations(this.data.id, this.data.body).subscribe((items: any) => {
      this.records = items.records;
      this.isFetching = false;
    });
  }

  nextPage() {
    if (!this.isFetching) {
      this.isFetching = true;
      const rec = this.records[this.records.length - 1];
      this.scheduledService
        .getInformations(
          this.data.id,
          this.data.body,
          rec.codigoErpEmpresa,
          rec.servicoProgramadoId
        )
        .subscribe((results: any) => {
          this.records = this.records.concat(results.records);
          this.isFetching = false;
        });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
