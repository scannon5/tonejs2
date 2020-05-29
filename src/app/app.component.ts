import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as Tone from "tone";
import { GridOptions, Grid } from './grid/grid.component';

@Component({
    selector: 'app-root',
    template: `
        <button type="button" (click)="play()">play</button>
        <div>
            <grid [opt]="gridOptions" #grid></grid>
        </div>
    `,
    styles: []
})
export class AppComponent implements AfterViewInit {

    @ViewChild("grid") grid: Grid;

    ngAfterViewInit(): void {
        console.log(this.grid)
    }
    
    play() {
        console.log("PLAY");

        //create a synth and connect it to the master output (your speakers)
        const synth = new Tone.Synth().toMaster();

        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease("C4", "8n");
    }

    gridOptions: GridOptions = {
        x: 100,
        y: 100,
        rows: 2,
        cols: 16,
        cellSize: 60,
        padding: 2,
        //onChange: onGridChange
    };
}
