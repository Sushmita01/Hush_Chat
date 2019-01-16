import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
  public statusMessage: string="";
  public initMessages;
  public messages=[];
  public dbFetchFlag= true;
  public allMessages;


  constructor(private chatService : ChatService) { }

  ngOnInit() {
    this.fetchMessages();
  }

  setStatus(status) {
    this.statusMessage=status;
    setTimeout(()=> {
      this.statusMessage="";},4000);
  }

  postMessage(msg){
    console.log("posting",msg);
    this.chatService.sendMessage({"name":'John Doe',"message":msg});
 }

  fetchMessages() {
    this.chatService.getMessage().subscribe(msg => {
      console.log("recieved in client",msg)
      if (this.dbFetchFlag==true) {
        this.initMessages=msg;
        this.allMessages = this.initMessages;
        this.dbFetchFlag=false;      
      }
      else {
        this.messages.push(msg);
        console.log(this.dbFetchFlag);       
        console.log(this.messages);
        this.allMessages = this.initMessages.concat(this.messages);
        console.log("all",this.allMessages)
      }

    });
  }


  clearChats() {
    this.chatService.clearDB().subscribe(status=> {
      if (status) {
        console.log("cleared db :)");
        this.allMessages = [];
        this.dbFetchFlag=true;
      }
    });
  }

}
