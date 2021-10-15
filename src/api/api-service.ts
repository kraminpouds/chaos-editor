import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { environment } from 'env';
import { Observable } from 'rxjs';
import { PlatformService } from '../app/platform.service';
import { CdkApiResponse } from './api-interface';

const isAbsoluteUrl = /^[a-zA-Z\-\+.]+:\/\//;

export class CdkApiService {
  private _headers: HttpHeaders = new HttpHeaders();
  private _options = { headers: this._headers, observe: 'body' as const, responseType: 'json' as const, withCredentials: true };

  constructor(private _http: HttpClient, private _platform: PlatformService, private _ngZone: NgZone, private _document: any) {}

  /**
   * 设置Header
   */
  setHeader(key: string, value: string | string[]): void {
    // 这里是通过克隆获取的新对象，需要重新赋值。
    this._headers = this._headers.set(key, value);
    this._options.headers = this._headers;
  }

  /**
   * Get请求
   *
   * @return an `Observable` of the body as a `CdkApiResponse`
   */
  get<T>(
    url: string,
    params?: HttpParams | { [param: string]: string | string[] },
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
    }
  ): Observable<CdkApiResponse<T>> {
    const _url = this._getUrl(url);
    return this._http.get<CdkApiResponse<T>>(_url, { ...this._options, params, ...options });
  }

  /**
   * Post请求
   *
   * @return an `Observable` of the body as a `CdkApiResponse`
   */
  post<T>(
    url: string,
    body: any | null,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
    }
  ): Observable<CdkApiResponse<T>> {
    const _url = this._getUrl(url);
    return this._http.post<CdkApiResponse<T>>(_url, body, { ...this._options, ...options });
  }

  /**
   * Delete请求
   *
   * @return an `Observable` of the body as a `CdkApiResponse`
   */
  delete<T>(
    url: string,
    body: any | null,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
    }
  ): Observable<CdkApiResponse<T>> {
    const _url = this._getUrl(url);
    return this._http.delete<CdkApiResponse<T>>(_url, { ...this._options, body, ...options });
  }

  downloadFileByPost(
    filename: string | null,
    url: string,
    body: any | null,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
      withCredentials?: boolean;
    }
  ): void {
    this._downloadFile(filename, 'post', url, { body, ...options });
  }

  downloadFileByGet(
    filename: string | null,
    url: string,
    params?: HttpParams | { [param: string]: string | string[] },
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
    }
  ): void {
    this._downloadFile(filename, 'get', url, { params, ...options });
  }

  downloadFileByLink(filename: string | null, url: string, params?: HttpParams | { [param: string]: string | string[] }): void {
    const _url = this._getUrl(url);
    const _params = params instanceof HttpParams ? params : new HttpParams({ fromObject: params || {} });
    const fileNameAndExt = (filename && filename.split('.')) || [];
    this._ngZone.runOutsideAngular(() => {
      const a = this._document.createElement('a');
      this._document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = _url + '?' + _params.toString();
      a.download = fileNameAndExt.join('.');
      a.click();
      a.remove(); // remove the element
    });
  }

  private _getUrl(url: string): string {
    const { protocol, hostname } = { protocol: this._platform.protocol, hostname: this._platform.hostname };
    if (!isAbsoluteUrl.test(url)) {
      const urlPrefix = `${protocol}//${hostname}`;
      const _url = new URL(environment.apiPrefix + url, urlPrefix);
      return _url.toString();
    }
    return url;
  }

  /**
   * 下载文件 (link)
   */
  private _downloadFile(
    filename: string | null,
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
    }
  ): void {
    const _url = this._getUrl(url);
    const opts = {
      ...this._options,
      responseType: 'blob' as const,
      observe: 'response' as const,
      ...options,
    };
    const fileNameAndExt = (filename && filename.split('.')) || [];
    this._http.request(method, _url, opts).subscribe(response => {
      let _fileNameAndExt: string[] = [];
      const disposition = response.headers.get('content-disposition') || '';
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches && matches[1]) {
        _fileNameAndExt = matches[1].replace(/['"]/g, '').split('.');
      }
      fileNameAndExt[0] = fileNameAndExt[0] || _fileNameAndExt[0];
      fileNameAndExt[1] = fileNameAndExt[1] || _fileNameAndExt[1];

      this._ngZone.runOutsideAngular(() => {
        const objectURL = window.URL.createObjectURL(response.body);
        const a = this._document.createElement('a');
        this._document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = objectURL;
        a.download = fileNameAndExt.join('.');
        a.click();
        window.URL.revokeObjectURL(objectURL);
        a.remove(); // remove the element
      });
    });
  }
}
