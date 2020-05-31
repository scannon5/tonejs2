import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: "synth-control",
    templateUrl: "./synth-control.component.html",
})
export class SynthControlComponent {

    @Input() blob: any;
    @Output() onChanged = new EventEmitter<void>();

    osc_type: string = "square";

    changed() {
        console.log("changed");
        this.onChanged.next();
    }
}