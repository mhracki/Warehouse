import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  

  constructor(private http:HttpClient) { }

  login(user){
    return this.http.post(environment.apiUserURL,user);

  }
  
}
