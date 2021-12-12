import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { CanvasService } from '../editor/canvas.service';
import { ScopeEnchantmentService } from '../editor/scope-enchantment/scope-enchantment.service';
import { WidgetOutline } from './model/widget-outline';

@Component({
  selector: 'chaos-editor-widget-shell',
  template: '<ng-content></ng-content>',
  styleUrls: ['./widget-shell.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetShellComponent implements OnInit, OnDestroy {
  private _document: Document;
  private readonly _destroyed = new Subject<void>();

  private _cacheDragMousePosition = { left: 0, top: 0 };

  @Input() widgetOutline!: WidgetOutline;

  constructor(
    private _elementRef: ElementRef,
    private _canvasService: CanvasService,
    private _enchantmentService: ScopeEnchantmentService,
    @Inject(DOCUMENT) _document: any
  ) {
    this._document = _document;
  }

  ngOnInit(): void {
    this._initializeDragEvent();
    this._initializeHoverEvent();

    if (this.widgetOutline) {
      this._elementRef.nativeElement.style.top = coerceCssPixelValue(this.widgetOutline.top);
      this._elementRef.nativeElement.style.left = coerceCssPixelValue(this.widgetOutline.left);
      this._elementRef.nativeElement.style.width = coerceCssPixelValue(this.widgetOutline.width);
      this._elementRef.nativeElement.style.height = coerceCssPixelValue(this.widgetOutline.height);

      this.widgetOutline._stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
        this._elementRef.nativeElement.style.top = coerceCssPixelValue(this.widgetOutline.top);
        this._elementRef.nativeElement.style.left = coerceCssPixelValue(this.widgetOutline.left);
        this._elementRef.nativeElement.style.width = coerceCssPixelValue(this.widgetOutline.width);
        this._elementRef.nativeElement.style.height = coerceCssPixelValue(this.widgetOutline.height);
      });
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeHoverEvent(): void {
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mouseenter')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._enchantmentService.setHighlightWidgetOutline(this.widgetOutline));

    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mouseleave')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._enchantmentService.setHighlightWidgetOutline(null));
  }

  private _initializeDragEvent(): void {
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousedown')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => {
        this._enchantmentService.activateWidgetOutline(this.widgetOutline);
        this._enchantmentService.cacheWidgetGuides();
        this._initializeDragSequence(event);
      });
  }

  private _initializeDragSequence(event: MouseEvent) {
    event.stopPropagation();
    this._cacheDragMousePosition = {
      left: event.pageX - this.widgetOutline.left,
      top: event.pageY - this.widgetOutline.top,
    };

    const moveEvent = fromEvent<MouseEvent>(this._canvasService.vesselElement || this._document, 'mousemove').pipe(
      takeUntil(this._destroyed)
    );
    const upEvent = fromEvent<MouseEvent>(this._document, 'mouseup').pipe(
      takeUntil(this._destroyed),
      take(1),
      tap(() => this._enchantmentService.deactivateWidgetGuides.next())
    );
    moveEvent.pipe(takeUntil(upEvent)).subscribe(event => this._onDrag(event));
  }

  private _onDrag(event: MouseEvent): void {
    const future = new WidgetOutline();
    future.updateSize({ width: this.widgetOutline.width, height: this.widgetOutline.height }).updatePosition({
      left: event.pageX - this._cacheDragMousePosition.left,
      top: event.pageY - this._cacheDragMousePosition.top,
    });
    const snappingPosition = this._enchantmentService.calcPositionForSnapToGuides(future);
    this.widgetOutline.updatePosition(snappingPosition);
  }
}
