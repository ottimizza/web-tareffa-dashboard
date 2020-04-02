
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { Observable } from 'rxjs';
import { GenericPageableResponse } from '@shared/models/GenericPageableResponse';
import { GenericResponse } from '@shared/models/GenericResponse';
import { Organization } from '@shared/models/Organization';
import { environment } from '@env';
import { Product } from '@shared/models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authorizationService: AuthenticationService) { }

  public fetch(searchCriteria: any): Observable<GenericResponse<Product>> {
    const params = this.encode(searchCriteria);
    const url = `${environment.oauthBaseUrl}/api/v1/products?${params}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.get<GenericResponse<Product>>(url, { headers });
  }

  public create(organization: Organization): Observable<GenericResponse<Product>> {
    const url = `${environment.oauthBaseUrl}/api/v1/products`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.post<GenericResponse<Product>>(url, organization, { headers });
  }

  public patch(id: number, organization: Organization): Observable<GenericResponse<Product>> {
    const url = `${environment.oauthBaseUrl}/api/v1/products/${id}`;
    const headers = this.authorizationService.getAuthorizationHeaders();
    return this.http.patch<GenericResponse<Product>>(url, organization, { headers });
  }

  encode(params: any): string {
    return Object.keys(params).map((key) => {
      return [key, params[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

}
