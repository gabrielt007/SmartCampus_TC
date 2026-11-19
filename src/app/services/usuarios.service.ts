import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';

import type { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://jsonplaceholder.typicode.com/users';

  listar(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint);
  }
}
