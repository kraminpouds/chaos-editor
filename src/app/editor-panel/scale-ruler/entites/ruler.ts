import { BehaviorSubject } from 'rxjs';
import { AuxiliaryLine } from './auxiliary-line';

export class ScaleRuler {
  horizontalRulerWidth = 0;
  verticalRulerHeight = 0;

  // 随鼠标移动的辅助线集合
  public dynamicLine$ = new BehaviorSubject<AuxiliaryLine | null>(null);

  // 固定的横向辅助线集合
  public horizontalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);

  // 固定的纵向辅助线集合
  public verticalLineList$ = new BehaviorSubject<Array<AuxiliaryLine>>([]);
}
