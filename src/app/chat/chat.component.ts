import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { iChatOption } from '../interfaces/chat-option';
import { iChatMessage } from '../interfaces/chat-messages';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('optionAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms', style({ transform: 'scale(1)', opacity: 1, color: "red" })),
      ]),
    ]),
  ],
})
export class ChatComponent {

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  
  chatMessages: iChatMessage[] = [];

  chatOptions: iChatOption[] = [
    {option: "Who are you?", message: "My name is Victor"},
    {option: "What are your skills?", message: "NodeJS, Angular"},
    {option: "Whats your professional experience?", message: "5 Years of experience"},
  ];

  animateMessage = false;

  sendMessage(option: iChatOption, index: number): void {
    // this.chatMessages.push(option);
    this.chatMessages.push({ side: "R", message: option.option});
    this.scroll()

    setTimeout(() => {    
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
