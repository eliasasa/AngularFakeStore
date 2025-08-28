import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-load',
  imports: [],
  templateUrl: './load.html',
  styleUrl: './load.scss',
  standalone: true,
  template: '<app-load></app-load>'
})
export class Load {

  @Input() message!: {
    message: string
  };

}
