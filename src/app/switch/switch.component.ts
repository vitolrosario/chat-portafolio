import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'switch-component',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {

  constructor() { }
  
  @Input() value: boolean = false;
  @Output() valueChange = new EventEmitter<boolean>();

  onToggle(event: any) {
    this.valueChange.emit(event.target.checked);
  }

  ngOnInit(): void {
  }

}
