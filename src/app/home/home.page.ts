import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import { WebSocketService } from '../services/web-socket-service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private webSocketService: WebSocketService) {
    // this.socket = io.connect('http://localhost:8000');
  }
  ngOnInit(): void {
    // here we want to listen to an event from the socket.io server
    this.webSocketService.listen('test event').subscribe((data) => {
      console.log(data);
    });
  }
}
