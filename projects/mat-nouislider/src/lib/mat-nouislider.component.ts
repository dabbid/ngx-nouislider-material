import noUiSlider from 'nouislider';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  OnChanges,
  Output,
  Renderer2,
  ViewChild,
  OnDestroy,
  SimpleChange
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface Formatter {
  to(value: number): string;
  from(value: string): number;
}

export interface Options {
  animate?: boolean;
  animationDuration?: number;
  behaviour?: string;
  connect?: boolean | boolean[];
  cssPrefix?: string;
  direction?: 'ltr' | 'rtl';
  format?: Formatter;
  keyboardSupport?: boolean;
  limit?: number;
  margin?: number;
  orientation?: 'horizontal' | 'vertical';
  padding?: number;
  range: any;
  snap?: boolean;
  start: number | string | Array<number | string>;
  step?: number;
  tooltips?: boolean | Function | Array<boolean | Function>;
}

const UPDATABLE_OPTIONS = [
  'animate',
  'limit',
  'margin',
  'pips',
  'range',
  'snap',
  'step'
];

const CSS_PREFIX = 'mat-nouislider-';

const defaultOptions: Options = {
  animate: true,
  animationDuration: 300,
  behaviour: 'tap',
  connect: true,
  cssPrefix: CSS_PREFIX,
  direction: 'ltr',
  format: {
    to(value: number): string {
      return String(parseFloat(parseFloat(String(value)).toFixed(2)));
    },
    from(value: string): number {
      return parseFloat(value);
    }
  },
  keyboardSupport: true,
  limit: undefined,
  margin: 0,
  orientation: 'horizontal',
  padding: 0,
  range: undefined,
  snap: false,
  start: undefined,
  step: undefined,
  tooltips: false
};

@Component({
  selector: 'mat-nouislider',
  template:
    '<div #nativeSlider [attr.disabled]="disabled || (formControl && formControl.disabled)"></div>',
  styles: [
    `
      :host {
        display: block;
        padding-bottom: 10px;
        padding-top: 36px;
      }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatNouisliderComponent),
      multi: true
    }
  ]
})
export class MatNouisliderComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input()
  animate: boolean;
  @Input()
  animationDuration: number;
  @Input()
  behaviour: string;
  @Input()
  connect: boolean | boolean[];
  @Input()
  options: Options = null;
  @Input()
  drection: 'ltr' | 'rtl';
  @Input()
  disabled: boolean;
  @Input()
  formControl: FormControl;
  @Input()
  format: Formatter;
  @Input()
  keyboardSupport: boolean;
  @Input()
  limit: number;
  @Input()
  margin: number;
  @Input()
  set max(n: number) {
    this.range = { ...this.range, max: n };
    this._max = n;
  }

  get max(): number {
    return this._max;
  }
  @Input()
  set min(n: number) {
    this.range = { ...this.range, min: n };
    this._min = n;
  }

  get min(): number {
    return this._min;
  }
  @Input()
  ngModel: number | number[];
  @Input()
  onKeydown: EventListenerOrEventListenerObject;
  @Input()
  orientation: 'horizontal' | 'vertical';
  @Input()
  padding: number;
  @Input()
  snap: boolean;
  @Input()
  step: number;
  @Input()
  tooltips: Array<any>;

  @Output()
  change: EventEmitter<any> = new EventEmitter(true);
  @Output()
  end: EventEmitter<any> = new EventEmitter(true);
  @Output()
  set: EventEmitter<any> = new EventEmitter(true);
  @Output()
  slide: EventEmitter<any> = new EventEmitter(true);
  @Output()
  start: EventEmitter<any> = new EventEmitter(true);
  @Output()
  update: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('nativeSlider')
  nativeSlider;

  handles: HTMLElement[];
  slider: any;

  private _max: number;
  private _min: number;
  private onChange: any = Function.prototype;
  private onTouched: any = Function.prototype;
  private range: { min: number; max: number } = { min: 0, max: 0 };
  private value: any;

  constructor(private renderer: Renderer2) {
    this.defaultKeyHandler = this.defaultKeyHandler.bind(this);
  }

  ngOnInit() {
    this.slider = noUiSlider.create(
      this.nativeSlider.nativeElement,
      this.getOptions(true)
    );
    // enable keyboard handling
    if (this.slider.options.keyboardSupport) {
      this.handles = Array.from(
        this.nativeSlider.nativeElement.querySelectorAll(`.${CSS_PREFIX}handle`)
      );
      this.handles.forEach((handle: HTMLElement, index: number) => {
        handle.setAttribute('tabindex', String(index));
        handle.addEventListener('click', this.onHandleClick);
        if (this.onKeydown) {
          handle.addEventListener('keydown', this.onKeydown);
        } else {
          handle.addEventListener('keydown', this.defaultKeyHandler);
        }
      });
    }
    // bind noui slider listeners to component's emitter
    this.slider.on('set', (values: string[], handle: number) => {
      this.eventHandler(this.set, values, handle);
    });

    this.slider.on('update', (values: string[]) => {
      this.update.emit(this.toValues(values));
    });

    this.slider.on('change', (values: string[]) => {
      this.change.emit(this.toValues(values));
    });

    this.slider.on('slide', (values: string[], handle: number) => {
      this.eventHandler(this.slide, values, handle);
    });

    this.slider.on('start', (values: string[]) => {
      this.start.emit(this.toValues(values));
    });

    this.slider.on('end', (values: string[]) => {
      this.end.emit(this.toValues(values));
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // TODO: if other properties than 'updatable' ones have changed
    // re instantiate noui slider with new options
    // (get changed values, if one or more is not 'updatable', re instantiate, otherwise update options)
    if (
      this.slider &&
      (Object.keys(changes).some((key: string) =>
        UPDATABLE_OPTIONS.includes(key)
      ) ||
        changes.options)
    ) {
      // setTimeout needed to prevent possible noui slider updates before ng changes are effective
      setTimeout(() => {
        this.slider.updateOptions(this.getOptions());
      });
    }
  }

  ngOnDestroy() {
    if (this.slider.options.keyboardSupport) {
      this.handles.forEach((handle: HTMLElement) => {
        handle.removeEventListener('click', this.onHandleClick);
        if (typeof this.onKeydown !== undefined) {
          handle.removeEventListener('keydown', this.onKeydown);
        } else {
          handle.removeEventListener('keydown', this.defaultKeyHandler);
        }
      });
    }
    this.slider.destroy();
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  reset() {
    if (this.slider) {
      this.slider.reset();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled
      ? this.renderer.setAttribute(
          this.nativeSlider.nativeElement,
          'disabled',
          'true'
        )
      : this.renderer.removeAttribute(
          this.nativeSlider.nativeElement,
          'disabled'
        );
  }

  toValues(values: string[]): any | any[] {
    const v = values.map(this.slider.options.format.from);
    return v.length === 1 ? v[0] : v;
  }

  writeValue(value: any): void {
    if (this.slider) {
      this.slider.set(value);
    }
  }

  private eventHandler(
    emitter: EventEmitter<any>,
    values: string[],
    handle: number
  ) {
    const v = this.toValues(values);
    let emitEvents = false;
    if (this.value === undefined) {
      this.value = v;
      return;
    }
    if (Array.isArray(v) && this.value[handle] !== v[handle]) {
      emitEvents = true;
    }
    if (!Array.isArray(v) && this.value !== v) {
      emitEvents = true;
    }
    if (emitEvents) {
      emitter.emit(v);
      this.onChange(v);
    }
    if (Array.isArray(v)) {
      this.value[handle] = v[handle];
    } else {
      this.value = v;
    }
  }

  defaultKeyHandler(e: KeyboardEvent) {
    const stepSize: any[] = this.slider.steps();
    const index = Number((e.target as HTMLElement).getAttribute('data-handle'));
    let sign = 1;
    let factor = 1;
    let step = 0;

    switch (e.which) {
      case 34: // PageDown
        factor = 10;
      // tslint:disable-next-line
      case 40: // ArrowDown
      case 37: // ArrowLeft
        sign = -1;
        step = stepSize[index][0];
        e.preventDefault();
        break;

      case 33: // PageUp
        factor = 10;
      // tslint:disable-next-line
      case 38: // ArrowUp
      case 39: // ArrowRight
        step = stepSize[index][1];
        e.preventDefault();
        break;

      default:
        break;
    }

    const delta = sign * factor * step;

    let newValue: number | number[];
    if (Array.isArray(this.value)) {
      newValue = [...this.value];
      newValue[index] = newValue[index] + delta;
    } else {
      newValue = this.value + delta;
    }

    this.slider.set(newValue);
  }

  private getOptions(isInitial = false) {
    const options = Object.keys(defaultOptions).reduce(
      (res: any, key: string): any => {
        if (this[key] != null && !(this[key] instanceof EventEmitter)) {
          res[key] = this[key];
        }
        return res;
      },
      {}
    );
    if (options.step && (!options.margin || options.margin < options.step)) {
      // slider range handles shouldn't overlap each other (i.e. user shouldn't be abble to define range like [10, 10])
      // so if step is defined, margin should at least equals step
      options.margin = options.step;
    }
    if (isInitial) {
      // only define 'start' option on init
      options.start = this.formControl ? this.formControl.value : this.ngModel;
      return { ...defaultOptions, ...options, ...this.options };
    }
    return { ...options, ...this.options };
  }

  private onHandleClick(e: Event) {
    (e.currentTarget as HTMLElement).focus();
  }
}
