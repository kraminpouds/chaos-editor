import { DOCUMENT } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable, NgModule, NgZone } from '@angular/core';
import { PlatformService } from '../app/platform.service';
import { CdkApiInterceptor } from './api-interceptor';
import { CdkApiService } from './api-service';

@Injectable()
export class CdkApiServiceFactory {
  private _caches = new Map<string, CdkApiService>();

  constructor(
    private _http: HttpClient,
    private _platform: PlatformService,
    private _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: any
  ) {}

  /**
   * 获取API服务接口
   * @param key -- cache key
   * @param forceNewInstance -- 是否新实力，默认false
   */
  getApiService(key: string, forceNewInstance = false): CdkApiService {
    let api: CdkApiService | undefined;
    if (!forceNewInstance && this._caches.has(key)) {
      api = this._caches.get(key);
    }
    if (!api) {
      api = new CdkApiService(this._http, this._platform, this._ngZone, this._document);
      if (!forceNewInstance) {
        this._caches.set(key, api);
      }
    }
    return api;
  }
}

@NgModule({
  imports: [HttpClientModule],
  exports: [HttpClientModule],
  providers: [
    { provide: CdkApiServiceFactory, useClass: CdkApiServiceFactory, deps: [HttpClient, PlatformService, NgZone, [new Inject(DOCUMENT)]] },
    { provide: HTTP_INTERCEPTORS, useClass: CdkApiInterceptor, multi: true },
  ],
})
export class CdkApiModule {}
