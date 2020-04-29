import { Component, OnInit } from '@angular/core';
import { IndicatorService } from '@app/services/indicator.service';
import { ToastService } from '@app/services/toast.service';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent implements OnInit {
  indicators = [];
  selectedIndicatorIndex: number = null;

  graphs = [];
  isLoadingGraphs = false;
  selectedGraphIndex: number = null;

  tags = [];
  services = [];

  constructor(private indicatorService: IndicatorService, private toast: ToastService) {}

  ngOnInit() {
    this.getIndicators();
  }

  showGraphsCard() {
    return this.selectedIndicatorIndex !== null && this.selectedIndicatorIndex !== undefined;
  }

  deleteIndicators(id: number) {
    this.indicatorService.deleteIndicators(id).subscribe((response: any) => {
      if (response.status === 'success') {
        this.toast.show(response.message, 'success');
        this.getIndicators();
      } else if (response.status === 'error') {
        this.toast.show(response.message, 'danger');
      }
    });
  }

  deleteGraph(id: number) {
    this.indicatorService.deleteGraph(id).subscribe((response: any) => {
      if (response.status === 'success') {
        this.toast.show(response.message, 'success');
        this.getGraphs();
      } else if (response.status === 'error') {
        this.toast.show(response.message, 'danger');
      }
    });
  }

  // --------------------------------- \\
  // -- Business Unity and Services -- \\
  // --------------------------------- \\

  updateTag(checked, tag) {
    if (checked) {
      this.update(tag.id, 'tag', checked);
    } else {
      this.update(tag.id, 'tag', checked);
    }
  }

  updateService(checked, service) {
    if (checked) {
      this.update(service.id, 'service', checked);
    } else {
      this.update(service.id, 'service', checked);
    }
  }

  update(value: number, input: 'service' | 'tag', checked) {
    const subject = new Subject();
    subject.subscribe({
      next: (response: any) => {
        this.toast.show(response.message, 'success');
      }
    });

    // Check if is adding or removing services/tags
    if (checked) {
      if (input === 'service') {
        this.indicatorService
          .addServiceToGraph(this.graphs[this.selectedGraphIndex].id, value)
          .subscribe(subject);
      } else if (input === 'tag') {
        this.indicatorService
          .addTagToGraph(this.graphs[this.selectedGraphIndex].id, value)
          .subscribe(subject);
      }
    } else {
      if (input === 'service') {
        this.indicatorService
          .removeServiceFromGraph(this.graphs[this.selectedGraphIndex].id, value)
          .subscribe(subject);
      } else if (input === 'tag') {
        this.indicatorService
          .removeTagFromGraph(this.graphs[this.selectedGraphIndex].id, value)
          .subscribe(subject);
      }
    }
  }

  showTagsAndServices() {
    console.log(this.selectedGraphIndex);

    this.tags = [];
    this.services = [];
    this.getTagsActives().then(() => {
      this.getTagsInactive().then(() => {
        this.getServiceActives().then(() => {
          this.getServicesInactive();
        });
      });
    });
  }

  getTagsActives(): Promise<any> {
    return new Promise((resolve, subject) => {
      this.indicatorService
        .getTags(this.graphs[this.selectedGraphIndex].id)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            response.records.forEach(element => {
              const obj = {
                descricao: element.descricao,
                id: element.id,
                isChecked: true
              };
              this.tags.push(obj);
            });
          } else {
            this.toast.show(response.message, 'danger');
          }
          resolve();
        });
    });
  }

  getTagsInactive(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.indicatorService
        .getTags(this.graphs[this.selectedGraphIndex].id, true)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            response.records.forEach(element => {
              const obj = {
                descricao: element.descricao,
                id: element.id,
                isChecked: false
              };
              this.tags.push(obj);
            });
          } else {
            this.toast.show(response.message, 'danger');
          }
          resolve();
        });
    });
  }

  getServiceActives(findService = ''): Promise<any> {
    return new Promise((resolve, subject) => {
      this.indicatorService
        .getServices(this.graphs[this.selectedGraphIndex].id, null, findService)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            response.records.forEach(element => {
              const obj = {
                nome: element.nome,
                id: element.id,
                isChecked: true
              };
              this.services.push(obj);
            });
          } else {
            this.toast.show(response.message, 'danger');
          }
        });
      resolve();
    });
  }

  getServicesInactive(findService = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.indicatorService
        .getServices(this.graphs[this.selectedGraphIndex].id, true, findService)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            response.records.forEach(element => {
              const obj = {
                nome: element.nome,
                id: element.id,
                isChecked: false
              };
              this.services.push(obj);
            });
          } else {
            this.toast.show(response.message, 'danger');
          }
        });
      resolve();
    });
  }

  // ------------ \\
  // -- Graphs -- \\
  // ------------ \\

  createGraph(input) {
    if (!input || input === '') {
      this.toast.show('Não é possível criar um gráfico sem nome!', 'warning');
      return;
    }
    this.indicatorService
      .createGraph(input, this.indicators[this.selectedIndicatorIndex].id)
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.getGraphs();
        } else {
          this.toast.show(response.message, 'danger');
        }
      });
  }

  editGraph(graph) {
    if (!graph || graph.nomeGrafico === '') {
      this.toast.show('Não é possível editar um gráfico sem nome!', 'warning');
      return;
    }

    this.indicatorService.updateGraph(graph.id, graph.nomeGrafico).subscribe((response: any) => {
      if (response.status === 'success') {
        this.toast.show(response.message, 'success');
      } else {
        this.toast.show(response.message, 'danger');
      }
    });
  }

  getGraphs() {
    this.isLoadingGraphs = true;
    this.indicatorService
      .getGraph(this.indicators[this.selectedIndicatorIndex].id)
      .pipe(
        finalize(() => {
          this.isLoadingGraphs = false;
        })
      )
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.graphs = response.records;
        }
      });
  }

  // ---------------- \\
  // -- Indicators -- \\
  // ---------------- \\

  createIndicator(input) {
    if (!input || input === '') {
      this.toast.show('Não é possível criar um indicador sem nome!', 'warning');
      return;
    }
    this.indicatorService.createIndicators(input).subscribe((response: any) => {
      if (response.status === 'success') {
        this.getIndicators();
      } else {
        this.toast.show(response.message, 'danger');
      }
    });
  }

  editIndicator(indicator) {
    if (!indicator || indicator.descricao === '') {
      this.toast.show('Não é possível editar um indicador sem nome!', 'warning');
      return;
    }

    this.indicatorService
      .updateIndicator(indicator.id, indicator.descricao)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status === 'success') {
          this.toast.show(response.message, 'success');
        } else {
          this.toast.show(response.message, 'danger');
        }
      });
  }

  getIndicators() {
    this.indicatorService.getIndicators().subscribe((response: any) => {
      if (response.status === 'success') {
        this.indicators = response.records;
      }
    });
  }
}
