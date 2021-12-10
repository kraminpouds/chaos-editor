import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { WidgetOutline } from '../../widget/model/widget-outline';
import { CanvasService } from '../canvas.service';
import { ScopeEnchantmentService } from './scope-enchantment.service';

export interface ReferencePointEvent {
  origin: { left: number; top: number; width: number; height: number };
  current: { leftDelta: number; topDelta: number };
}

@Directive({
  selector: '[nceReferencePoint]',
})
export class ReferencePointDirective implements OnInit, OnDestroy {
  @Input() pointPositionX!: 'left' | 'center' | 'right';
  @Input() pointPositionY!: 'top' | 'center' | 'bottom';
  @Output() nceDrag = new EventEmitter<ReferencePointEvent>();

  private _document: Document;
  private readonly _destroyed = new Subject<void>();

  private _cacheDragMousePosition = { left: 0, top: 0 };
  private _cacheOutlineOrigin = { left: 0, top: 0, width: 0, height: 0 };
  private _activatedOutline: WidgetOutline | null = null;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _canvasService: CanvasService,
    private _enchantmentService: ScopeEnchantmentService,
    @Inject(DOCUMENT) _document: any
  ) {
    this._document = _document;
  }

  ngOnInit(): void {
    this._renderer.addClass(this._elementRef.nativeElement, `${this.pointPositionX}-${this.pointPositionY}`);
    this._initializeDragEvent();

    this._enchantmentService.activatedWidgetOutlineChange.pipe(takeUntil(this._destroyed)).subscribe(outline => {
      this._activatedOutline = outline;
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  private _initializeDragEvent(): void {
    fromEvent<MouseEvent>(this._elementRef.nativeElement, 'mousedown')
      .pipe(takeUntil(this._destroyed))
      .subscribe(event => this._initializeDragSequence(event));
  }

  private _initializeDragSequence(event: MouseEvent) {
    if (!this._activatedOutline) {
      return;
    }
    event.stopPropagation();
    this._cacheDragMousePosition = {
      left: event.pageX,
      top: event.pageY,
    };
    this._cacheOutlineOrigin = {
      left: this._activatedOutline.left,
      top: this._activatedOutline.top,
      width: this._activatedOutline.width,
      height: this._activatedOutline.height,
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
    const { left, top } = this._canvasService.getCanvasVesselRect();
    // todo 不应该拖拽出Vessel边缘
    this.nceDrag.next({
      origin: this._cacheOutlineOrigin,
      current: {
        leftDelta: event.pageX - this._cacheDragMousePosition.left,
        topDelta: event.pageY - this._cacheDragMousePosition.top,
      },
    });
  }
}
