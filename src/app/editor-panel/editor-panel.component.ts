import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MouseWheel } from '../mouse-wheel/mouse-wheel';
import { ScaleRulerService } from './scale-ruler/scale-ruler.service';
import { VirtualScrollBarService } from './virtual-scroll-bar/virtual-scroll-bar.service';

@Component({
  selector: 'chaos-editor-panel',
  templateUrl: './editor-panel.component.html',
  styleUrls: ['./editor-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditorPanelComponent implements OnInit {
  constructor(private _virtualScrollBarService: VirtualScrollBarService, private _scaleRulerService: ScaleRulerService) {}

  ngOnInit(): void {
    void 0;
  }

  /**
   * 接收鼠标的滚轮事件
   * 改变滚动条的位置以及视图区域
   */
  mouseWheel(event: MouseWheel, canvas: HTMLDivElement): void {
    const rect = canvas.getBoundingClientRect();
    rect.width -= 26;
    rect.height -= 26;

    const { offsetX, horizontalScrollBarWidth } = this._virtualScrollBarService;
    // 往左最大只能滚动到现有左偏移
    let deltaX = Math.max(-offsetX, event.deltaX);
    // 往右滚动到底后
    if (deltaX + offsetX + horizontalScrollBarWidth > rect.width) {
      // 滚动条变最小
      deltaX = Math.max(rect.width - horizontalScrollBarWidth - offsetX, 0);
    }

    const { offsetY, verticalScrollBarHeight } = this._virtualScrollBarService;
    // 往上最大只能滚动到现有上偏移
    let deltaY = Math.max(-offsetY, event.deltaY);
    // 往下滚动到底后
    if (deltaY + offsetY + verticalScrollBarHeight > rect.height) {
      deltaY = Math.max(rect.height - verticalScrollBarHeight - offsetY, 0);
    }

    this._virtualScrollBarService.moveto(deltaX, deltaY);
    this._scaleRulerService.moveto(deltaX, deltaY);
  }
}
