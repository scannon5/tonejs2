import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Grid } from './grid/grid.component';
import { SynthControlComponent } from './synth-control/synth-control.component';

@NgModule({
    declarations: [
        AppComponent,
        Grid,
        SynthControlComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
