import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  httpURL: string = 'http://localhost:3000/productlist/';
  httpURL1: string = 'http://localhost:3000/categorylist/';

  constructor(private http: HttpClient) {}

  postProduct(data: any) {
    console.log('post ' + data);
    return this.http.post<any>(this.httpURL, data);
  }
  getProduct() {
    return this.http.get<any>(this.httpURL);
  }
  putProduct(data: any, id: number) {
    return this.http.put<any>(this.httpURL + id, data);
  }
  deleteProduct(id: number) {
    return this.http.delete<any>(this.httpURL + id);
  }
  
  // Category Services
  getCategory() {
    return this.http.get<any>(this.httpURL1);
  }
  postCategory(data: any) {
    return this.http.post<any>(this.httpURL1, data);
  }
  putCategory(data: any, id: number) {
    return this.http.put<any>(this.httpURL1 + id, data);
  }
}
