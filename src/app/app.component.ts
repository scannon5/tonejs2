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

    ngAfterViewInit(): void {

        this.grid.setRowState(0, [0, 4, 8, 12]);
        this.grid.setRowState(1, [2, 6, 10, 14]);
        this.onGridChange(this.grid);
        this.beatSub = this.seq.beat$.subscribe(b => this.grid.setBeat(b));
    }
    
    play() {
        this.seq.play();
    }

    onGridChange = (grid: Grid) => {
        this.seq.update(grid);
    }
    
    gridOptions: GridOptions = {
        x: 100,
        y: 100,
        rows: 2,
        cols: 16,
        cellSize: 60,
        padding: 2,
        onChange: this.onGridChange,
    };
}
