import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = `${environment.apiBaseUrl.replace(/\/+$/, '')}/api`;

  constructor(private http: HttpClient) { }

  /**
   * Every post for the admin table, including scheduled ones. The public
   * list endpoint (post/category) hides anything not yet live, which meant a
   * scheduled post could not be opened for editing.
   */
  getBlogs() {
    return this.http.get<any[]>(`${this.apiUrl}/post/adminList`);
  }

  deleteBlog(id: number) {
    return this.http.delete(`${this.apiUrl}/post/${id}`);
  }
}
