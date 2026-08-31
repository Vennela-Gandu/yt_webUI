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
    categoryId?: number | null, publishedOnly: boolean = false,
    author?: string) {
    let params: any = { page, pageSize, publishedOnly };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (author) params.author = author;
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

  /** Related guides shown under an equipment article. */
  getRelated(id: number, top = 5) {
    return this.http.get<any[]>(`${this.api}/related/${id}`, { params: { top } });
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
          .map(s => ({
            id: s.categoryID,
            name: this.subCategoryName(s.name, main.name)
          }))
      }));
  }

  /**
   * The display name for a sub-category.
   *
   * Every main category has one called "Others", so on their own the four are
   * indistinguishable in the sidebar — and they all slug to /equipment/others,
   * which left three of the four unreachable by URL. Naming them after their
   * parent makes both the label and the URL unique.
   */
  subCategoryName(name: string, parentName: string): string {
    return /^others?$/i.test((name || '').trim())
      ? `Other ${parentName}`
      : name;
  }
}
