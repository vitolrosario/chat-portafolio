import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { iChatOption } from '../interfaces/chat-option';
import { iChatMessage } from '../interfaces/chat-messages';
import { ThrowStmt } from '@angular/compiler';

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
    // {option: "How many years of experience do you have in software development?", message: "I have over 5 years of experience in software development.", show: false},
    // {option: "What technologies do you specialize in?", message: "I specialize in <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular</li><li>.NET</li><li>MongoDB</li><li>SQL (SQL Server and Oracle)</li></ul>", show: false},
  ];

  animateMessage = false;
  loading: boolean = false;
  isCannonVisible: boolean = false;
  showCannonBtn: boolean = false;

  async sendMessage(option: iChatOption, index: number): Promise<void> {
    option.fade = true

    await this.pushMessageByLetter("R", option.option)
    
    this.scroll()

    await this.wait(100)

    this.loading = true

    await this.wait(1500)

    option.show = false
    this.loading = false

    await this.pushMessageByLetter("L", option.message)
    
    this.chatOptions.length > index+1 ? this.chatOptions[index+1].show = true : this.showCannonBtn = true

    this.scroll()
  } 

  async pushMessageByLetter(side: "L" | "R", message: string) : Promise<void> {
    this.chatMessages.push({ side, message: ""});

    const messageIndex: number = this.chatMessages.length - 1

    for (const [i, letter] of message.split('').entries()) {
      await this.wait(50)
  
      this.scroll()
      
      this.chatMessages[messageIndex].message += letter
    }

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

  wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  showCannon() : void {
    this.isCannonVisible = true;
    this.showCannonBtn = false
  }

}
