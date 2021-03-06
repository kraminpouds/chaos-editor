import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  readonly isBrowser: boolean;
  readonly isServer: boolean;
  readonly isMobile: boolean;
  readonly hostname: string;
  readonly protocol: string;

  document: Document;

  constructor(@Inject(DOCUMENT) document: any, @Inject(PLATFORM_ID) platformId: string, @Optional() @Inject(REQUEST) private request: any) {
    this.document = document;
    this.isBrowser = platformId ? isPlatformBrowser(platformId) : typeof document === 'object' && !!document;
    this.isServer = isPlatformServer(platformId);

    if (this.isBrowser) {
      this.isMobile = !!this.getWindow().navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      this.hostname = location.hostname;
      this.protocol = location.protocol;
    } else {
      this.isMobile = false;
      this.hostname = request.hostname;
      this.protocol = request.protocol + ':';
    }
  }

  getWindow(): Window {
    return this.document.defaultView || window;
  }
}
