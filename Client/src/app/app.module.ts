import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AppRouting} from "./app.routing";
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {ChatService} from './services/chat.service'

const config: SocketIoConfig = { url: 'http://localhost:2000', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
  ],
  imports: [
    BrowserModule,AppRouting,HttpClientModule,SocketIoModule.forRoot(config)
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
