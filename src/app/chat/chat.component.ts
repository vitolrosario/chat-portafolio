import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('optionAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChatComponent {
  chatMessages: string[] = [];
  chatOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];

  sendMessage(option: string, index: number): void {
    this.chatMessages.push(option);
    this.chatMessages.push(this.getStaticAnswer(option));
    setTimeout(() => {
      this.chatOptions.splice(index, 1);
    }, 300);
  }

  getStaticAnswer(option: string): string {
    // Return static answer based on selected option
    switch (option) {
      case 'Option 1':
        return 'This is the answer for Option 1.';
      case 'Option 2':
        return 'This is the answer for Option 2.';
      case 'Option 3':
        return 'This is the answer for Option 3.';
      default:
        return '';
    }
  }
}
