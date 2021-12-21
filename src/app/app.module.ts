import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeleteOutline, DownSquareOutline, PictureOutline, UpSquareOutline } from '@ant-design/icons-angular/icons';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(zh);

const icons = [DeleteOutline, DownSquareOutline, PictureOutline, UpSquareOutline];

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'chaos-editor' }),
    BrowserAnimationsModule,
    BrowserTransferStateModule,

    NzIconModule.forRoot(icons),
    NzDropDownModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-cn' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'CNY' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
