import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentRequest, ApiResponse } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.apiBaseUrl}/api/content`;

  constructor(private http: HttpClient) { }

  generateContent(request: ContentRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate`, request);
  }
}
