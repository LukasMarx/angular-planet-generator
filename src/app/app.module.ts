import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PolygonService } from './polygon.service';
import { PlanetComponent } from './planet/planet.component';

@NgModule({
   declarations: [
      AppComponent,
      PlanetComponent
   ],
   imports: [
      BrowserModule
   ],
   providers: [
      PolygonService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {}
