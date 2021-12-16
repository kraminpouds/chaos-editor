import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CanvasService } from '../../editor/canvas.service';
import { ScopeEnchantmentService } from '../../editor/scope-enchantment/scope-enchantment.service';
import { WidgetRef } from '../../widget/model/widget-ref';

@Component({
  selector: 'chaos-editor-widget-trigger',
  templateUrl: './widget-trigger.component.html',
  styleUrls: ['./widget-trigger.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTriggerComponent implements OnInit, OnDestroy {
  @Input() widgetRef!: WidgetRef;
  @HostBinding('class') className = 'widget-trigger';

  private readonly _destroyed = new Subject<void>();
  private _changeClass = (className: string, status: boolean) =>
    status ? this._elementRef.nativeElement.classList.add(className) : this._elementRef.nativeElement.classList.remove(className);

  constructor(
    private _elementRef: ElementRef,
    private _canvasService: CanvasService,
    private _enchantmentService: ScopeEnchantmentService
  ) {}

  ngOnInit(): void {
    this._initializeHoverEvent();
    this._initializeClickEvent();

    this._enchantmentService.highlightWidgetOutlineChange
      .pipe(takeUntil(this._destroyed))
      .subscribe(outline => this._changeClass('hover', this.widgetRef.outline === outline));

    this._enchantmentService.activatedWidgetOutlineChange
      .pipe(takeUntil(this._destroyed))
      .subscribe(outline => this._changeClass('active', this.widgetRef.outline === outline));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeHoverEvent(): void {
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mouseenter')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._enchantmentService.setHighlightWidgetOutline(this.widgetRef.outline));

    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mouseleave')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._enchantmentService.setHighlightWidgetOutline(null));
  }

  private _initializeClickEvent(): void {
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'click')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._enchantmentService.activateWidgetOutline(this.widgetRef.outline));
  }

  removeWidget(widgetRef: WidgetRef): void {
    this._canvasService.removeWidget(widgetRef);
    // 移除模版效果
    this._enchantmentService.setHighlightWidgetOutline(null);
    if (this._enchantmentService.activatedWidgetOutline === widgetRef.outline) {
      this._enchantmentService.activateWidgetOutline(null);
    }
  }
}
