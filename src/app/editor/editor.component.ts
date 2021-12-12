import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime, take, takeUntil } from 'rxjs/operators';
import { MouseWheel } from '../mouse-wheel/mouse-wheel';
import { CanvasService } from './canvas.service';
import { ScaleRulerService } from './scale-ruler/scale-ruler.service';
import { ScopeEnchantmentService } from './scope-enchantment/scope-enchantment.service';
import { VirtualScrollBarService } from './virtual-scroll-bar/virtual-scroll-bar.service';

@Component({
  selector: 'chaos-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasVessel', { static: true }) canvasVesselRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLDivElement>;

  readonly widgets = this._canvasService.widgets;
  private _destroyed = new Subject<void>();

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    private _virtualScrollBarService: VirtualScrollBarService,
    private _scaleRulerService: ScaleRulerService,
    private _canvasService: CanvasService,
    private _enchantmentService: ScopeEnchantmentService,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this._virtualScrollBarService.changed.pipe(takeUntil(this._destroyed), auditTime(10)).subscribe(() => {
      this._scaleRulerService.updateOnScroll();
      this.canvasRef.nativeElement.style.transform = `translate(${-this._virtualScrollBarService.offsetX}px, ${-this
        ._virtualScrollBarService.offsetY}px)`;
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterViewInit() {
    this._ngZone.onStable.pipe(take(1), takeUntil(this._destroyed)).subscribe(() => {
      // 注册容器
      this._canvasService.withVesselElement(this.canvasVesselRef).withCanvasElement(this.canvasRef);
      this._scaleRulerService.withVesselElement(this.canvasVesselRef).withCanvasElement(this.canvasRef);
      this._virtualScrollBarService
        .withVesselElement(this.canvasVesselRef, this._scaleRulerService.vesselRulerSize)
        .withCanvasElement(this.canvasRef)
        .resetOffset();
    });
  }

  /**
   * 接收鼠标的滚轮事件
   * 改变滚动条的位置以及视图区域
   */
  mouseWheel(event: MouseWheel): void {
    this._virtualScrollBarService.move(event.deltaX, event.deltaY);
  }

  mouseDown(): void {
    // 取消激活的轮廓
    this._enchantmentService.activateWidgetOutline(null);
  }
}
