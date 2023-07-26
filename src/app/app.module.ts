import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { LoaderComponent } from './loader/loader.component';
import { CannonComponent } from './cannon/cannon.component';
import { SwitchComponent } from './switch/switch.component';
import { VirusGameComponent } from './virus-game/virus-game.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoaderComponent,
    CannonComponent,
    SwitchComponent,
    VirusGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
