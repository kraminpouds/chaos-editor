import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicModule } from 'ng-dynamic-component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { WidgetShopComponent } from './widget-shop.component';

@NgModule({
  declarations: [WidgetShopComponent],
  imports: [CommonModule, NzGridModule, DynamicModule],
  exports: [WidgetShopComponent],
})
export class WidgetShopModule {}
