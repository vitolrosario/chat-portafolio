import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { iChatOption } from '../interfaces/chat-option';
import { iChatMessage } from '../interfaces/chat-messages';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent {

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  chatMessages: iChatMessage[] = [];

  chatOptions: iChatOption[] = [
    {option: "Who are you?", message: "My name is Victor Rosario and i'm a fullstack software developer.", show: true},
    {option: "How many years of experience do you have in software development?", message: "I have over 5 years of experience in software development.", show: false},
    {option: "What technologies do you specialize in?", message: "I specialize in <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular</li><li>.NET</li><li>MongoDB</li><li>SQL (SQL Server and Oracle)</li></ul>", show: false},
  ];

  animateMessage = false;
  loading: boolean = false;

  sendMessage(option: iChatOption, index: number): void {
    option.fade = true
    this.chatMessages.push({ side: "R", message: option.option});
    this.scroll()

    setTimeout(() => {
      this.loading = true
    }, 100);

    setTimeout(() => {    
      option.show = false
      this.loading = false
      this.chatOptions[index+1] ? this.chatOptions[index+1].show = true : null
      this.chatMessages.push({ side: "L", message: option.message});
      this.scroll()
  }, 1500);
  } 
  
  scroll() {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100);

    } catch (err) {
      console.error(err);
    }
  }

}
