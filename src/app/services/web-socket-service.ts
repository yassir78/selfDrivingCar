import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: any;
  readonly uri: string = 'ws://127.0.0.1:7070';
  constructor() {
    console.log("okay le's connect to the socket");
    this.socket = io(this.uri);

    console.log("we're done");
  }
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
