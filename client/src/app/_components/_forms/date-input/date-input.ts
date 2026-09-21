import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  ReactiveFormsModule,
  NgControl,
} from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  imports: [BsDatepickerModule, ReactiveFormsModule],
  templateUrl: './date-input.html',
  styleUrl: './date-input.css',
})
export class DateInput implements ControlValueAccessor {
  @Input() label!: string;
  @Input() maxDate!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-red',
    dateInputFormat: 'DD MMMM YYYY',
    isAnimated: false
  };

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
