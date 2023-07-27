import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, Renderer2 } from '@angular/core';
import { iChatOption } from '../interfaces/chat-option';
import { iChatMessage } from '../interfaces/chat-messages';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent {
  
  constructor(
  ) { }

  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('typingSound') typingSound!: ElementRef;
  @ViewChild('gameSound') gameSound!: ElementRef;
  
  chatMessages: iChatMessage[] = [];

  gameMode: boolean = false

  chatOptionsDefault: iChatOption[] = [
    {option: "Who are you?", message: "My name is Victor Rosario and i'm a fullstack software developer.", show: true},
    {option: "How many years of experience do you have in software development?", message: "I have over 5 years of experience in software development.", show: false},
    {option: "What technologies do you specialize in?", message: "I specialize in <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular</li><li>.NET</li><li>MongoDB</li><li>SQL (SQL Server and Oracle)</li></ul>", show: false},
  ];

  chatOptionsGameMode: iChatOption[] = [
    {option: "Start Game", message: "Ah, welcome, my name is Victor Rosario and i'm a fullstack software developer.", show: true},
    {option: "How many years of experience do you have in software development?", message: "Experience matters little in the face of my coding abilities. Nevertheless, I have sharpen my skills for over a decade.", show: false},
    {option: "What technologies do you specialize in?", message: "My specialization goes far beyond your measly understanding. I command the forces of <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular</li><li>.NET</li><li>MongoDB</li><li>SQL (SQL Server and Oracle)</li></ul>", show: false},
  ];

  chatOptions: iChatOption[] = this.chatOptionsDefault;

  animateMessage = false;
  loading: boolean = false;
  isCannonVisible: boolean = false;
  showCannonBtn: boolean = false;
  selectedFontFamily: string = "JetBrains Mono, monospace !important"
  
  ngAfterViewInit() {
    this.typingSound.nativeElement.addEventListener('ended', () => {
      this.playAudio(this.typingSound);
    });
    this.gameSound.nativeElement.addEventListener('ended', () => {
      this.playAudio(this.gameSound);
    });
  }

  async sendMessage(option: iChatOption, index: number): Promise<void> {
    option.fade = true

    if (!this.gameMode)
      this.chatMessages.push({ side:"R", message: option.option})
    else 
      this.chatMessages = []
    // await this.pushMessageByLetter("R", option.option)
    
    this.scroll()

    await this.wait(100)

    if (!this.gameMode)
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

    this.playAudio(this.typingSound)

    for (const [i, letter] of message.split('').entries()) {
      await this.wait(40)

      this.scroll()
      
      this.chatMessages[messageIndex].message += letter
    }

    this.pauseAudio(this.typingSound)

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

  playAudio(audio: ElementRef) {
    if (this.gameMode)
      audio.nativeElement.play();
      audio.nativeElement.volume = 0.2
  }

  pauseAudio(audio: ElementRef) {
    audio.nativeElement.pause();
  }

  changeGameMode() {
    this.selectedFontFamily = this.gameMode ? "Arcade Rounded !important" : "JetBrains Mono, monospace !important"
    if (this.gameMode) {
      this.playAudio(this.gameSound)
      this.chatOptions = this.chatOptionsGameMode
      this.chatMessages = []
      this.toogleClass("app-container", "app-container-game")
      this.toogleClass("chat-messages", "game")
    }
    else {
      this.pauseAudio(this.gameSound)
      this.pauseAudio(this.typingSound)
      this.chatOptions = this.chatOptionsDefault
      this.chatMessages = []
      this.toogleClass("app-container", "app-container-game")
      this.toogleClass("chat-messages", "game")
    }
    this.showCannonBtn = false
  }

  loadScript(url: string) {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }

  addClass(className: string, classToAdd: string) {
    document.getElementsByClassName(className)[0].classList.add(classToAdd)
  }

  removeClass(className: string, classToAdd: string) {
    document.getElementsByClassName(className)[0].classList.remove(classToAdd)
  }

  toogleClass(className: string, classToAdd: string) {
    document.getElementsByClassName(className)[0].classList.toggle(classToAdd)
  }

}
