import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScheduledService } from '@app/http/scheduled.service';

@Component({
  templateUrl: './collaborator-list-dialog.component.html'
})
export class CollaboratorListDialogComponent implements OnInit {
  constructor(
    public scheduledService: ScheduledService,
    public dialogRef: MatDialogRef<CollaboratorListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; filter: any }
  ) {}

  ngOnInit(): void {
    const body = {
      dataProgramada: new Date(this.data.filter.dataProgramadaInicio),
      filtro: this.data.filter
    };
    this.scheduledService.getInformations(this.data.id, body).subscribe(a => console.log(a));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
