import { Injectable } from '@angular/core';
import { Socket,SocketIoConfig } from 'ngx-socket-io';
import {Observable,Observer} from 'rxjs';
const config: SocketIoConfig = { url: 'http://localhost:2000', options: {} };


@Injectable({
    providedIn: 'root',
})
export class ChatService {
    observer: Observer<any>;

  constructor(private socket: Socket) { 
  }
 
    sendMessage(msg: Object){ 
        this.socket.emit("input", msg);
    }

    getMessage() : any{
        this.socket.on("output", response => {
            return this.observer.next(response);
          });
          return this.createObservable();
    }

    clearDB() {
        this.socket.emit("clear");
        this.socket.on("cleared", () => {
            return this.observer.next(true);
          });
          return this.createObservable();

    }


    createObservable() {
        return new Observable(observer => this.observer = observer);
      }
}
