import { ViewportRuler } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { PlatformService } from '../../platform.service';
import { VirtualScrollBarService } from './virtual-scroll-bar.service';

@Component({
  selector: 'chaos-editor-virtual-scroll-bar',
  templateUrl: './virtual-scroll-bar.component.html',
  styleUrls: ['./virtual-scroll-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollBarComponent implements OnInit, OnDestroy {
  get horizontalWidth(): number {
    return this._virtualScrollBarService.horizontalWidth;
  }

  get verticalHeight(): number {
    return this._virtualScrollBarService.verticalHeight;
  }

  get position() {
    return this._virtualScrollBarService.position;
  }

  get transformX(): string {
    return `translateX(${this._virtualScrollBarService.offsetX}px)`;
  }

  get transformY(): string {
    return `translateY(${this._virtualScrollBarService.offsetY}px)`;
  }

  private _destroyed = new Subject<void>();

  constructor(
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _virtualScrollBarService: VirtualScrollBarService,
    private _platform: PlatformService,
    private _viewportRuler: ViewportRuler
  ) {}

  ngOnInit(): void {
    this._virtualScrollBarService.changed.pipe(takeUntil(this._destroyed), auditTime(10)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  dragScrollBar(axis: 'x' | 'y', event: MouseEvent): void {
    this._virtualScrollBarService.move((axis === 'x' && event.movementX) || undefined, (axis === 'y' && event.movementY) || undefined);
  }
}
