import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  //Creation d'une instance SocketIOClient
  socket: SocketIOClient.Socket;
  readonly uri: string = 'https://autonomabackend.herokuapp.com/';
  constructor() {
    //Connexion au serveur 
    this.socket = io.connect(this.uri);
  }
  //Ecoute de nouvelles informations
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  
  //Emit d'une nouvelle valeur
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
