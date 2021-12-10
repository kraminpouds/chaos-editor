import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArrowLeftOutline } from '@ant-design/icons-angular/icons';
import { CdkApiModule } from 'api';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorPanelModule } from './editor-panel/editor-panel.module';
import { WidgetPanelModule } from './widget-panel/widget-panel.module';

registerLocaleData(zh);

const icons = [ArrowLeftOutline];

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'chaos-editor' }),
    BrowserAnimationsModule,
    CdkApiModule,
    BrowserTransferStateModule,
    EditorPanelModule,
    NzMessageModule,
    NzIconModule.forRoot(icons),
    NzBackTopModule,
    CdkScrollableModule,
    NzLayoutModule,
    WidgetPanelModule,
    OverlayModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: LOCALE_ID, useValue: 'zh-cn' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CNY' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
