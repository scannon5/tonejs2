import * as Tone from "tone";
import { Grid } from "./grid/grid.component";
import { Subject } from 'rxjs';

export class Sequencer {

    bassdrum: any;
    hihat: any;

    range1: any;
    range1display: any;

    constructor() {
        this.init();

        //set the transport to repeat
        Tone.Transport.loopEnd = '1m';
        Tone.Transport.loop = true;

        // document.querySelector("body").addEventListener("keydown", e => Tone.Transport.toggle());
        // this.range1 = document.getElementById("range1");
        // this.range1.addEventListener("input", this.range1changed);
        // this.range1display = document.getElementById("range1display");

        //this.beat$.subscribe(console.log);
    }

    public play() {
        Tone.Transport.toggle();
    }

    private range1changed = (e: any) => {
        this.range1display.innerHTML = this.range1.value;
        this.hihat.envelope.attack = +this.range1.value;
    }

    private init() {
        this.bassdrum = new Tone.MembraneSynth().toMaster();
        this.hihat = new Tone.NoiseSynth().toMaster();
    }

    private triggerBassdrum = (time: any) => {
        this.bassdrum.triggerAttackRelease('C2', '8n', time)
    }
    private triggerHihat = (time: any) => {
        this.hihat.triggerAttackRelease('4n', time)
    }

    public update(grid: Grid) {
        Tone.Transport.cancel();
        
        let assign = (track: number, callback: any) => {
            for (let n = 0; n < 4; n++) {
                for (let s = 0; s < 4; s++) {  
                    if (grid.cellStates[track][n * 4 + s] == 1) {
                        Tone.Transport.schedule(callback, `0:${n}:${s}`);
                    }
                }
            }
        }

        assign(0, this.triggerBassdrum);
        assign(1, this.triggerHihat);

        this.scheduleDrawing();

    }

    beat$ = new Subject<number>();

    private scheduleDrawing() {
        const beat = (b: number, when: string) => {
            Tone.Transport.schedule(time => {
                Tone.Draw.schedule(() => {
                    this.beat$.next(b);
                }, time)
            }, when);
        }

        let b = 0;
        for (let n = 0; n < 4; n++) {
            for (let s = 0; s < 4; s++) {
                beat(b++, `0:${n}:${s}`);
            }
        }
    }

}