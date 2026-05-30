import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) { }

  getBlogs() {
    // return this.http.get<any[]>(`${this.apiUrl}/list`);
       let params: any = {
        page: 1,
        pageSize: 0
      };
     params.categoryId = -1;
    return this.http.get<any>(`${this.apiUrl}/post/category/`, {params});
  }

  deleteBlog(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
