
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { Observable } from 'rxjs';
import { User } from '@shared/models/User';
import { GenericPageableResponse } from '@shared/models/GenericPageableResponse';
import { GenericResponse } from '@shared/models/GenericResponse';
import { environment } from '@env';
import { Organization } from '@shared/models/Organization';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authorizationService: AuthenticationService) { }

  public fetch(searchCriteria: any): Observable<GenericPageableResponse<User>> {
    const params = this.encode(searchCriteria);
    const url = `${environment.oauthBaseUrl}/api/v1/users?${params}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericPageableResponse<User>>(url, { headers });
  }

  public fetchById(id: number): Observable<GenericResponse<User>> {
    const url = `${environment.oauthBaseUrl}/api/v1/users/${id}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericResponse<User>>(url, { headers });
  }

  public patch(id: number, data: any): Observable<GenericResponse<User>> {
    const url = `${environment.oauthBaseUrl}/api/v1/users/${id}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.patch<GenericResponse<User>>(url, data, { headers });
  }

  //
  //
  public fetchOrganizations(id: number, searchCriteria: any): Observable<GenericPageableResponse<Organization>> {
    const params = this.encode(searchCriteria);
    const url = `${environment.oauthBaseUrl}/api/v1/users/${id}/organizations?${params}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericPageableResponse<Organization>>(url, { headers });
  }

  public appendOrganization(id: number, organization: Organization): Observable<GenericPageableResponse<Organization>> {
    const url = `${environment.oauthBaseUrl}/api/v1/users/${id}/organizations`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.post<GenericPageableResponse<Organization>>(url, organization, { headers });
  }

  public removeOrganization(id: number, organizationId: number): Observable<GenericPageableResponse<Organization>> {
    const url = `${environment.oauthBaseUrl}/api/v1/users/${id}/organizations/${organizationId}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.delete<GenericPageableResponse<Organization>>(url, { headers });
  }

  encode(params: any): string {
    return Object.keys(params).map((key) => {
      return [key, params[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

}
