import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { ApplicationRef, Inject, Injectable, isDevMode, Optional } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { PlatformService } from '../app/platform.service';
import { CdkApiResponse, ForceCacheHeader, ForceNoCacheHeader } from './api-interface';

export interface TransferHttpResponse {
  body?: any | null;
  headers?: { [name: string]: string | string[] };
  status?: number;
  statusText?: string;
  url?: string;
}

function getHeadersMap(headers: HttpHeaders): Record<string, string[]> {
  const headersMap: Record<string, string[]> = {};
  for (const key of headers.keys()) {
    headersMap[key] = headers.getAll(key) || [];
  }

  return headersMap;
}

@Injectable()
export class CdkApiInterceptor implements HttpInterceptor {
  private isCacheActive = true;

  constructor(
    appRef: ApplicationRef,
    private transferState: TransferState,
    private readonly platform: PlatformService,
    @Optional() @Inject(REQUEST) private httpRequest: Request
  ) {
    // Stop using the cache if the application has stabilized, indicating initial rendering is complete.
    appRef.isStable.pipe(first(stable => stable)).subscribe(() => {
      console.log('App is stable now');
      this.isCacheActive = false;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<CdkApiResponse<any>>> {
    if (this.platform.isServer) {
      req = req.clone({
        setHeaders: { Cookie: this.httpRequest.headers.cookie || '' },
      });
    }

    const httpEvent = next.handle(req).pipe(
      map((event: HttpEvent<CdkApiResponse<any>>) => {
        if (event instanceof HttpResponse) {
          // 仅对JSON的API作用
          const isApi = (event.headers.get('content-type') as string).indexOf('application/json;') >= 0;
          if (isApi && event.body) {
            const body = event.body;
            if (body.status !== 0) {
              throw new HttpErrorResponse({
                error: body,
                headers: event.headers,
                status: body.status,
                statusText: body.message,
                url: event.url || undefined,
              });
            }
          }
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (isDevMode() || this.platform.isServer) {
          console.error(err);
        }
        const error = err.error || {};
        const body: CdkApiResponse<any> = {
          data: error.data || {},
          message: error.message || err.message,
          status: error.status || err.status,
          time: error.time || new Date().toISOString(),
        };
        return observableOf(
          new HttpResponse({
            body,
            headers: err.headers,
            status: err.status,
            statusText: err.message,
            url: err.url || undefined,
          })
        );
      })
    );

    if (!this.isCacheActive || req.headers.has(ForceNoCacheHeader) || (req.method !== 'GET' && !req.headers.has(ForceCacheHeader))) {
      if (isDevMode() && this.platform.isServer) {
        console.log('[Angular Universal][Request] skip cache', req.method, req.url, ', force', req.headers.has(ForceCacheHeader));
      }
      this.invalidateCacheEntry(req.url);
      return httpEvent;
    }

    const storeKey = this.makeCacheKey(req.method, req.url, req.params, req.body);

    if (this.transferState.hasKey(storeKey)) {
      // Request found in cache. Respond using it.
      const response = this.transferState.get(storeKey, {} as TransferHttpResponse);
      if (isDevMode()) {
        console.log('from cache', req.method, req.url, response.body);
      }
      this.transferState.remove(storeKey);
      return observableOf(
        new HttpResponse<any>({
          body: response.body,
          headers: new HttpHeaders(response.headers),
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        })
      );
    } else {
      if (this.platform.isServer) {
        console.log(
          '[Angular Universal][Request]',
          req.method,
          req.url,
          req.params,
          req.body,
          ', force',
          req.headers.has(ForceCacheHeader)
        );
      }
      return httpEvent.pipe(
        tap((event: HttpEvent<CdkApiResponse<any>>) => {
          if (event instanceof HttpResponse) {
            if (this.platform.isServer) {
              console.log('[Angular Universal][Response]', event.status, event.url);
            }
            this.transferState.set(storeKey, {
              body: event.body,
              headers: getHeadersMap(event.headers),
              status: event.status,
              statusText: event.statusText,
              url: event.url || '',
            });
          }
        })
      );
    }
  }

  private invalidateCacheEntry(url: string): void {
    Object.keys((this.transferState as any).store).forEach(key =>
      key.includes(url) ? this.transferState.remove(makeStateKey(key)) : null
    );
  }

  private makeCacheKey(method: string, url: string, params: HttpParams, body: any): StateKey<TransferHttpResponse> {
    // make the params encoded same as a url so it's easy to identify
    const encodedParams = params
      .keys()
      .sort()
      .map(k => `${k}=${params.getAll(k)}`)
      .join('&');
    const encodedBody = JSON.stringify(body);
    const key = method[0] + '.' + url + '?' + encodedParams + ';B.' + encodedBody;

    return makeStateKey<TransferHttpResponse>(key);
  }
}
