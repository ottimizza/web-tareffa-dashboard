
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { Observable } from 'rxjs';
import { GenericPageableResponse } from '@shared/models/GenericPageableResponse';
import { GenericResponse } from '@shared/models/GenericResponse';
import { Organization } from '@shared/models/Organization';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient, private authorizationService: AuthenticationService) { }

  public fetch(searchCriteria: any): Observable<GenericPageableResponse<Organization>> {
    const params = this.encode(searchCriteria);
    const url = `${environment.oauthBaseUrl}/api/v1/organizations?${params}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericPageableResponse<Organization>>(url, { headers });
  }

  public fetchById(id: number): Observable<GenericResponse<Organization>> {
    const url = `${environment.oauthBaseUrl}/api/v1/organizations/${id}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericResponse<Organization>>(url, { headers });
  }

  public create(organization: Organization): Observable<GenericResponse<Organization>> {
    const url = `${environment.oauthBaseUrl}/api/v1/organizations`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.post<GenericResponse<Organization>>(url, organization, { headers });
  }

  public patch(id: number, organization: Organization): Observable<GenericResponse<Organization>> {
    const url = `${environment.oauthBaseUrl}/api/v1/organizations/${id}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.patch<GenericResponse<Organization>>(url, organization, { headers });
  }

  encode(params: any): string {
    return Object.keys(params).map((key) => {
      return [key, params[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

}
