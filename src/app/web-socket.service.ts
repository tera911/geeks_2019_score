import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor() {
  }


  serve(): WebSocketSubject<MessageEvent> {
    return webSocket({
      url: `ws://172.16.255.248:5001`,
      deserializer: message => {
        return message;
      }
    });
  }
}
