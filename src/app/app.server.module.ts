import { XhrFactory } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
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
  imports: [AppModule, ServerModule, NoopAnimationsModule, ServerTransferStateModule],
  bootstrap: [AppComponent],
  providers: [{ provide: XhrFactory, useClass: ServerXhr }],
})
export class AppServerModule {}
