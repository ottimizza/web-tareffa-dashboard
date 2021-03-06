import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { DateUtils } from '@shared/utils/date.utils';
import { SideFilterConversorUtils } from '@shared/components/side-filter/utils/side-filter-conversor.utils';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const BASE_URL = environment.serviceGetUrl;

@Injectable({ providedIn: 'root' })
export class ScheduledService {
  constructor(private _http: HttpClient, private _authenticationService: AuthenticationService) {}

  getServicoProgramado(filter: any) {
    const url = `${BASE_URL}/servico/programado`;
    return this._http.post(url, filter, this._headers);
  }

  getCategory() {
    const url = `${BASE_URL}/categoria`;
    return this._http.get(url, this._headers);
  }

  getCharacteristic() {
    const url = `${BASE_URL}/caracteristica?description=04`;
    return this._http.get(url, this._headers);
  }

  getGroupedScheduled(grouping: number, body = this._thisMonth) {
    const url = `${BASE_URL}/servico/programado/agrupamento/${grouping}`;
    return this._http.post(url, body, this._headers);
  }

  getInformations(id: number, filter: any, lastOrganizationERP?: string, lastUserId?: number) {
    let url = `${BASE_URL}/servico/programado/${id}/informacao?limit=20`;

    if (lastUserId && lastOrganizationERP) {
      url += `&beforeServicoId=${lastUserId}&beforeCodigoErp=${lastOrganizationERP}`;
    }

    return this._http.post(url, filter, this._headers);
  }

  getFilters(firstGroup = 0, secondGroup = 1) {
    const categories$ = this.getCategory();
    const services$ = this.getGroupedScheduled(firstGroup);
    const departments$ = this.getGroupedScheduled(secondGroup);
    const caracteristics$ = this.getCharacteristic();

    return combineLatest([categories$, departments$, services$, caracteristics$]).pipe(
      map(([categories, departments, services, caracteristics]: any[]) => ({
        categories,
        departments,
        services,
        caracteristics
      }))
    );
  }

  private get _headers() {
    const headers = this._authenticationService.getAuthorizationHeaders();
    return { headers };
  }

  private get _thisMonth() {
    const reference = new Date();
    const dates = {
      startDate: DateUtils.iterateDays(-1, date => date.getDate() === 1).getTime(),
      endDate: new Date(
        DateUtils.iterateDays(1, date => {
          return (
            date.getDate() === 1 &&
            (date.getMonth() === reference.getMonth() + 1 || date.getMonth() === 0)
          );
        }).getTime() -
          24 * 60 * 60 * 1000
      ).getTime()
    };

    return SideFilterConversorUtils.convertToDashboardRequest(dates);
  }
}
