import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { CdkApiModule } from 'api';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { LayerModule } from '../layer/layer.module';
import { WidgetShopModule } from '../widget-shop/widget-shop.module';
import { EditorModule } from './editor.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [
    MainRoutingModule,

    CdkApiModule,
    CdkScrollableModule,
    OverlayModule,

    NzBackTopModule,
    NzLayoutModule,
    NzMessageModule,
    NzTabsModule,

    EditorModule,
    LayerModule,
    WidgetShopModule,
  ],
})
export class MainModule {}
