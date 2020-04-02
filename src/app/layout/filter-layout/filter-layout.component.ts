import { ActivatedRoute } from '@angular/router';
import { FilterService } from '@app/services/filter.service';
import { Filter } from '@shared/models/Filter';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-filter-layout',
  templateUrl: './filter-layout.component.html',
  styleUrls: ['./filter-layout.component.scss']
})
export class FilterLayoutComponent implements OnInit, OnChanges {
  opened: boolean;

  filter = new Filter();

  selectExampleArray = [
    'Olá',
    'teste',
    'Cool Buda',
    'Billy Johnson',
    'Be happy!',
    'Rock and Roll',
    'Save the world',
    'THE END'
  ];

  selectedItems = this.selectExampleArray;

  constructor(private filterService: FilterService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.filter = JSON.parse(this.filterService.getFilters());
    this.route.data.subscribe(data => {
      if (data) {
        this.filterService.requestIndicators().subscribe((response: any) => {
          this.filter.addSelect('Indicador', response.records);
        });
        this.filterService.requestDepartments().subscribe((response: any) => {
          this.filter.addSelect('Departamento', response.records);
        });
      }
    });
  }

  ngOnChanges() {
    console.log('asdfasdf');
  }

  search(query: string) {
    console.log('query', query);
    const result = this.select(query);
    this.selectedItems = result;
  }

  select(query: string): string[] {
    const result: string[] = [];
    for (const item of this.selectExampleArray) {
      if (item.toLowerCase().indexOf(query) > -1) {
        result.push(item);
      }
    }
    return result;
  }

  selectAll(e, form) {
    // this.filterControl.formControl[form].setValue(e.checked ? this.selectedItems : []);
  }

  // Helper
  StringIsNumber = value => isNaN(Number(value)) === false;

  // Turn enum into array
  ToArray(enumme) {
    return Object.keys(enumme)
      .filter(this.StringIsNumber)
      .map(key => enumme[key]);
  }
}
