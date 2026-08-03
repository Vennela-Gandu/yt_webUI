import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  api = environment.apiBaseUrl.replace(/\/+$/, '') + '/api/equipment';

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<any[]>(`${this.api}/categories`);
  }

  getList(page: number, pageSize: number, search: string,
    categoryId?: number | null, publishedOnly: boolean = false) {
    let params: any = { page, pageSize, publishedOnly };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    return this.http.get<any>(`${this.api}/list`, { params });
  }

  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  add(data: any) {
    return this.http.post<any>(`${this.api}/add`, data);
  }

  update(data: any) {
    return this.http.put(`${this.api}/edit`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  // Flat category rows (CategoryID, Name, ParentCategoryID) -> [{ id, name, subs:[{id,name}] }]
  buildCategoryTree(flat: any[]): any[] {
    return (flat || [])
      .filter(c => !c.parentCategoryID)
      .map(main => ({
        id: main.categoryID,
        name: main.name,
        subs: (flat || [])
          .filter(s => s.parentCategoryID === main.categoryID)
          .map(s => ({ id: s.categoryID, name: s.name }))
      }));
  }
}
