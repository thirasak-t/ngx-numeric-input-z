import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[NgxNumericInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInputDirective),
      multi: true,
    },
  ],
})
export class NumericInputDirective implements ControlValueAccessor {
  @Input() min?: number;
  @Input() max?: number;
  @Input() decimalPlaces: number | null = null;
  @Input() allowDecimal: boolean = true;
  @Input() enforceMax: boolean = true; // 🆕 ใหม่: ควบคุมพฤติกรรม max

  private onChange = (value: number | null) => {};
  private onTouched = () => {};
  private lastCleanValue = '';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    const cleanValue = rawValue.replace(/,/g, '');

    if (!this.isValidNumberInput(cleanValue)) {
      this.restoreLastValue();
      return;
    }

    // ตรวจสอบจำนวนจุดทศนิยม
    if (
      this.allowDecimal &&
      this.decimalPlaces != null &&
      this.decimalPlaces >= 0
    ) {
      const parts = cleanValue.split('.');
      if (parts.length === 2 && parts[1].length > this.decimalPlaces) {
        this.restoreLastValue();
        return;
      }
    }

    const numericValue = parseFloat(cleanValue);

    if (isNaN(numericValue)) {
      this.lastCleanValue = cleanValue;
      this.setValue(cleanValue);
      this.onChange(null);
      return;
    }

    // ✅ enforceMax = true → ไม่ให้กรอกเกิน
    if (this.enforceMax && this.max != null && numericValue > this.max) {
      this.restoreLastValue();
      return;
    }

    this.lastCleanValue = cleanValue;
    this.setValue(this.formatNumber(cleanValue));
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur() {
    const value = parseFloat(this.lastCleanValue);

    // ✅ เช็ค min ตอน blur
    if (!isNaN(value) && this.min != null && value < this.min) {
      this.lastCleanValue = this.min.toString();
      this.setValue(this.formatNumber(this.lastCleanValue));
      this.onChange(this.min);
    }

    // ✅ ถ้า enforceMax = false → เช็ค max ตอน blur
    if (
      !isNaN(value) &&
      !this.enforceMax &&
      this.max != null &&
      value > this.max
    ) {
      this.lastCleanValue = this.max.toString();
      this.setValue(this.formatNumber(this.lastCleanValue));
      this.onChange(this.max);
    }

    this.onTouched();
  }

  writeValue(value: number | null): void {
    const strValue = value != null ? value.toString() : '';
    this.lastCleanValue = strValue;
    this.setValue(this.formatNumber(strValue));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private setValue(val: string) {
    this.el.nativeElement.value = val;
  }

  private restoreLastValue() {
    this.setValue(this.formatNumber(this.lastCleanValue));
  }

  private formatNumber(value: string): string {
    if (value === '') return '';
    const [intPart, decimalPart] = value.split('.');
    const formattedInt = parseInt(intPart, 10).toLocaleString('en-US');
    return decimalPart != null
      ? `${formattedInt}.${decimalPart}`
      : formattedInt;
  }

  private isValidNumberInput(value: string): boolean {
    if (value === '') return true;

    // ไม่อนุญาตทศนิยม
    if (!this.allowDecimal) {
      return /^-?\d*$/.test(value);
    }

    // อนุญาตทศนิยม 1 จุด
    return /^-?\d*(\.\d*)?$/.test(value);
  }
}
