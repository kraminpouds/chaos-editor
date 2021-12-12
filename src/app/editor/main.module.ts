import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { ArrowLeftOutline } from '@ant-design/icons-angular/icons';
import { CdkApiModule } from 'api';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { WidgetShopModule } from '../widget-shop/widget-shop.module';
import { EditorModule } from './editor.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

const icons = [ArrowLeftOutline];

@NgModule({
  declarations: [MainComponent],
  imports: [
    MainRoutingModule,

    CdkApiModule,
    OverlayModule,
    NzMessageModule,
    NzIconModule.forRoot(icons),
    NzBackTopModule,
    NzLayoutModule,

    CdkScrollableModule,
    EditorModule,
    WidgetShopModule,
    NzTabsModule,
  ],
})
export class MainModule {}
