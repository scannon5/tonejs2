import { Component, Input, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';

export interface GridOptions {
    x: number;
    y: number;
    rows: number;
    cols: number;
    cellSize: number;
    padding: number;
    onChange?: (grid: Grid) => void;
}

@Component({
    selector: "grid",
    template: "<canvas #cvs (click)='clickHandler($event)' [width]='canvasWidth' [height]='canvasHeight'></canvas>",
})
export class Grid implements AfterViewInit  {

    @Input() opt: GridOptions;
    @ViewChild("cvs") canvas: ElementRef<HTMLCanvasElement>;

    ctx: CanvasRenderingContext2D;

    public cellStates: number[][];
    private beatNumber: number = null;

    constructor () {
    }

    ngAfterViewInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.cellStates = new Array(this.opt.cols);
        this.ctx.strokeStyle = "#aaa";

        this.initGrid();
        this.clearGrid();
        this.drawGrid();
    }

    get canvasWidth() { return this.opt.cellSize * this.opt.cols; }
    get canvasHeight() { return this.opt.cellSize * this.opt.rows; }

    initGrid() {
        for (var r = 0; r < this.opt.rows; r++) {
            this.cellStates[r] = new Array(this.opt.cols);
        }
    }

    clearGrid() {
        for (var r = 0; r < this.opt.rows; r++) {
            for (var c = 0; c < this.opt.cols; c++) {
                this.cellStates[r][c] = 0;
            }
        }        
    }

    drawGrid() {
        var stateToStyle = (r: number, c: number) => {
            switch (this.cellStates[r][c])
            {
                case 0: return "#aaa";
                case 1: return "#f77";
                case 2: return "#888";
                default: return "#000";
            }
        }
        for (var r = 0; r < this.opt.rows; r++) {
            for (var c = 0; c < this.opt.cols; c++) {
                this.ctx.fillStyle = stateToStyle(r, c);
                this.ctx.fillRect(
                    c * this.opt.cellSize + this.opt.padding, 
                    r * this.opt.cellSize + this.opt.padding, 
                    this.opt.cellSize - (2 * this.opt.padding), 
                    this.opt.cellSize - (2 * this.opt.padding));
            }
        }
        
        if (this.beatNumber != null) {
            this.ctx.fillStyle = "#ff0";
            this.forEachRow(r => {
                this.ctx.fillRect(
                    (this.beatNumber + 0.5) * this.opt.cellSize - 5, 
                    (r + 0.5) * this.opt.cellSize - 5, 
                    10, 
                    10);
            })
        }
    }

    getCell = (x: number, y: number) => {
        return {
            c: Math.floor(x / this.opt.cellSize),
            r: Math.floor(y / this.opt.cellSize)
        }; 
    }

    clickHandler = (e: any) => {
        e = this.getCursorPosition(e);
        var cell = this.getCell(e.x, e.y);
        this.cellStates[cell.r][cell.c] = this.cellStates[cell.r][cell.c] == 0 ? 1 : 0;
        this.drawGrid();
        this.callChangeHandler();
    }

    private getCursorPosition(event) {
        const rect = this.canvas.nativeElement.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }    

   private callChangeHandler() {
        if (this.opt.onChange) {
            this.opt.onChange(this);
        }
    }

    public setRowState(row: number, cells: number[]) {
        this.clearRow(row);
        cells.forEach(x => {
            this.cellStates[row][x] = 1;
        });
        this.drawGrid();
        this.callChangeHandler();
    }

    private clearRow(row: number) {
        this.forEachCol(c => this.cellStates[row][c] = 0);
    }

    private forEachCol(f: (c: number) => void) {
        for(let c = 0; c < this.opt.cols; c++) {
            f(c);
        }
    }

    private forEachRow(f: (r: number) => void) {
        for(let r = 0; r < this.opt.rows; r++) {
            f(r);
        }
    }
    public setBeat(beat: number) {
        this.beatNumber = beat;
        this.drawGrid();
    }


    
}