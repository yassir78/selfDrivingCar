import { Component, OnInit, SecurityContext } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from '../services/web-socket-service';
import { delay } from 'rxjs/internal/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  speed$: Observable<any>;
  image$: Observable<any>;
  imgSrc: SafeUrl;
  vitesse: string;
  direction$: Observable<any>;
  direction: string;
  speed: string;
  fadeOut: boolean;
  constructor(
    private webSocketService: WebSocketService,
    private domSanitize: DomSanitizer,
    public loadingController: LoadingController
  ) {
    // this.socket = io.connect('http://localhost:8000');
    this.speed$ = this.webSocketService.listen('test');
    this.speed = '0';
    this.image$ = this.webSocketService.listen('image');
    this.speed$.subscribe((speed) => {
      this.speed = speed;
    });
    this.direction$ = this.webSocketService.listen('turn');
    this.fadeOut = true;
    this.direction = '';
    this.direction$.subscribe((direction) => {
      if (direction != null) {
        this.direction = direction.response;
      }
    });
    this.imgSrc = '../assets/myCar1.png';
  }

  sanitize(url: string) {
    return this.domSanitize.bypassSecurityTrustUrl(url);
  }
  ngOnInit(): void {
    this.image$.subscribe(
      (image) => {
        this.fadeOut = false;
        console.log(image);
        this.imgSrc = this.sanitize('data:image/png;base64, ' + image.response);
      },
      (error) => {
        console.log('invalid');
      }
    );
  }
}
