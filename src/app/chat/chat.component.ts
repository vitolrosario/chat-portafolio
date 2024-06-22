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
    {option: "Quien eres?", message: "Mi nombre es Victor Rosario y soy un fullstack software developer.", show: true},
    {option: "Cuantos años de experiencia tienes en el desarrollo de software?", message: "Tengo mas de 6 años de experiencia en el desarrollo de software", show: false},
    {option: "En que tecnologias te especializas?", message: "Me especializo en <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular 2+</li><li>.NET/Core</li><li>MongoDB</li><li>PostgreSQL, Oracle</li></ul>", show: false},
  ];

  chatOptionsGameMode: iChatOption[] = [
    {option: "Empezar Juego", message: "Ah, bienvenido, mi nombre es Victor Rosario y soy un fullstack software developer.", show: true},
    {option: "Cuantos años de experiencia tienes en el desarrollo de software?", message: "La experiencia importa poco frente a mis habilidades de desarrollo. Sin embargo, he perfeccionado mis habilidades durante más de una década.", show: false},
    {option: "En que tecnologias te especializas?", message: "Mi especialización va mucho más allá de su miserable comprensión. Yo gobierno las fuerzas de <ul style='margin-left: 20px !important'><li>Node.js</li><li>AngularJS, Angular 2+</li><li>.NET/Core</li><li>MongoDB</li><li>SQL Server, Oracle</li></ul>", show: false},
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

    // if (!this.gameMode)
      this.chatMessages.push({ side:"R", message: option.option})
      // await this.pushMessageByLetter("R", option.option)
    // else 
    //   this.chatMessages = []
    
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
