import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { IconService } from "./icon.service";

@Component({
  selector: "nge-icon",
  standalone: true,
  imports: [CommonModule],
  template: ``,
  host: {
    class: "[&>*]:w-full [&>*]:h-full",
  },
})
export class IconComponent implements OnChanges {
  @Input() public path!: string;
  @Output() public inserted: EventEmitter<void> = new EventEmitter();

  constructor(private iconService: IconService, private el: ElementRef) {}

  ngOnChanges() {
    this.initSource();
  }

  initSource() {
    this.iconService.getSvg(this.path).subscribe((svgContent) => {
      this.el.nativeElement.innerHTML = svgContent;
      this.inserted.emit();
    });
  }
}
