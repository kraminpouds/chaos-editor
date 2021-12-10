import { Type } from '@angular/core';

export interface Widget<T = any> {
  // 组件的宽度
  width: number;
  // 组件的高度
  height: number;
  // 组件的左定位
  left: number;
  // 组件的上定位
  top: number;
  // 组件的层级关系
  zIndex: number;
  // 类型
  type: WidgetType;
  // todo 内容？
  content: Object;
  // 组件对象
  component: Type<T>;
}

export enum WidgetType {
  TEXT,
}
