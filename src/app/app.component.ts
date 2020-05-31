import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { GridOptions, Grid } from './grid/grid.component';
import { Sequencer } from './sequencer';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    template: `
        <button type="button" (click)="play()">play/stop</button>
        <div>
            <grid [opt]="gridOptions" #grid></grid>
        </div>
        <div>
            <synth-control [blob]="synth1_blob" (onChanged)="synth1_changed()"></synth-control>
        </div>
    `,
    styles: []
})
export class AppComponent implements AfterViewInit, OnDestroy {
    ngOnDestroy(): void {
        this.beatSub.unsubscribe();
    }

    @ViewChild("grid") grid: Grid;
    seq = new Sequencer();
    beatSub: Subscription;
    synth1_blob: any = {
        //osc_type: "sine"
    };

    ngAfterViewInit(): void {
        this.grid.setRowState(0, [0, 4, 8, 12]);
        //this.grid.setRowState(1, [2, 6, 10, 14]);
        this.grid.setRowState(2, [0, 6]);
        this.beatSub = this.seq.beat$.subscribe(b => this.grid.setBeat(b));
    }
    
    play() {
        this.seq.play();
    }

    onGridChange = (grid: Grid) => {
        this.seq.update(grid);
    }
    
    synth1_changed() {
        this.seq.synth1_changed(this.synth1_blob);
    }

    gridOptions: GridOptions = {
        x: 100,
        y: 100,
        rows: 3,
        cols: 16,
        cellSize: 60,
        padding: 2,
        onChange: this.onGridChange,
    };
}
