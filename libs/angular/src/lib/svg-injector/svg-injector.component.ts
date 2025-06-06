import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SvgInjectorService } from './svg-injector.service';

@Component({
  selector: 'nge-svg-injector',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  host: {
    class: '[&>*]:w-full [&>*]:h-full',
  },
})
export class SvgInjector implements OnChanges {
  @Input() public path!: string;
  @Output() public inserted: EventEmitter<void> = new EventEmitter();

  constructor(private el: ElementRef, private iconService: SvgInjectorService) {}

  ngOnChanges() {
    this.initSource();
  }

  initSource() {
    if (this.path.startsWith('http')) {
      this.iconService.getSvg(this.path).subscribe((svgContent) => {
        this.el.nativeElement.innerHTML = svgContent;
        this.inserted.emit();
      });
    } else {
      this.iconService.getSvg(this.path).subscribe((svgContent) => {
        this.el.nativeElement.innerHTML = svgContent;
        this.inserted.emit();
      });
    }
  }
}
