import { XhrFactory } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { CdkApiModule } from 'api';
import { NZ_I18N, NzI18nModule, zh_CN } from 'ng-zorro-antd/i18n';
// @ts-ignore
import * as xhr2 from 'xhr2';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

class ServerXhr implements XhrFactory {
  build(): XMLHttpRequest {
    xhr2.XMLHttpRequest.prototype._restrictedHeaders = {};
    return new xhr2.XMLHttpRequest();
  }
}

@NgModule({
  imports: [AppModule, ServerModule, CdkApiModule, NoopAnimationsModule, NzI18nModule, ServerTransferStateModule],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: XhrFactory, useClass: ServerXhr },
  ],
})
export class AppServerModule {}
