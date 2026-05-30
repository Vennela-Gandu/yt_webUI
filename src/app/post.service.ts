import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  api = environment.apiBaseUrl.replace(/\/+$/, '') + '/api';

  constructor(private http: HttpClient) { }

  getCategories(type:any) {
    return this.http.get<any[]>(`${this.api}/post/getAllCategories?type=` + type);
  }

  addPost(data: any) {
    return this.http.post(`${this.api}/post/add`, data);
  }

  updatePost(data: any) {
    return this.http.put(`${this.api}/post/edit`, data);
  }

  getPostsByCategory(page: number,
    pageSize: number,
    search: string,
    categoryId?: number) {
    let params: any = {
      page,
      pageSize
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    return this.http.get<any>(`${this.api}/post/category/`, {params});
  }
  getPostById(id: number) {
    return this.http.get<any>(`${this.api}/post/${id}`);
  }

  getAllFAQs(page: number,
    pageSize: number,
    search: string,
    categoryId?: number) {
    let params: any = {
      page,
      pageSize
    };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    return this.http.get<any>(`${this.api}/post/getAllFAQs`, { params });
  }

  getFAQById(id: number) {
    return this.http.get<any>(`${this.api}/post/getFAQById/${id}`);
  }

  addFAQ(faq: any) {
    return this.http.post(`${this.api}/post/addFAQ`, faq);
  }

  updateFAQ(id: number, faq: any) {
    return this.http.put(`${this.api}/post/updateFAQ/${id}`, faq);
  }
  getRelatedPosts(postId: number) {
    return this.http.get<any[]>(
      `${this.api}/post/related/${postId}`
    );
  }
}
