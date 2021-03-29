import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Mascota } from '../_model/mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  url: String = `${environment.host}/api/mascotas`;

  constructor(private http: HttpClient) { }

  getMascotas(): Observable<any>{
    return this.http.get(`${this.url}/get`);
  }

  postMascota(mascota: Mascota): Observable<any>{
    return this.http.post<any>(`${this.url}/post`,mascota);
  }

  deleteMascota(id: String): Observable<any>{
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

}
