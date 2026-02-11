import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UtmTranslateService {
  readonly SOURCE_LANG = 'nl-NL';
  readonly TARGET_LANG = 'en-US';
  shouldTranslate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private translateService: TranslateService) {}

  async translateString(stringToTranslate: string | undefined): Promise<string> {
    if (!stringToTranslate) {
      return '';
    }

    const doesNotNeedTranslation =
      !this.translateService.currentLang || this.translateService.currentLang === 'nl';
    if (doesNotNeedTranslation) {
      return stringToTranslate;
    }

    if (!this.shouldTranslate.getValue()) {
      return stringToTranslate;
    }

    const requestBody = {
      contents: stringToTranslate,
      sourceLanguageCode: this.SOURCE_LANG,
      targetLanguageCode: this.TARGET_LANG,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const response: { translation: string } = await lastValueFrom(
      this.http.post<{ translation: string }>(environment.translateUrl, requestBody, httpOptions),
    );
    return response.translation.toString();
  }

  public async translateObjectByKey(obj: any, key: string): Promise<any> {
    if (key in obj) {
      obj[key] = await this.translateString(obj[key]);
    }

    return obj;
  }

  public async translateObjectByKeys(obj: any, keys: string[]): Promise<any> {
    const promises = [];
    for (const key of keys) {
      promises.push(this.translateObjectByKey(obj, key));
    }
    return await Promise.all(promises);
  }

  public async translateObjectsByKeys(objs: any[], keys: string[]): Promise<any> {
    const promises = [];
    for (const obj of objs) {
      promises.push(this.translateObjectByKeys(obj, keys));
    }
    return await Promise.all(promises);
  }

  public getAsEnglishIfApplicable(obj: any, key: string, englishKey: string): string {
    if (!obj) {
      return '';
    }

    if (this.translateService.currentLang !== 'en') {
      return obj?.[key];
    }

    if (englishKey in obj && obj[englishKey]) {
      return obj[englishKey];
    }
    if (key in obj) {
      return obj[key];
    }
    return '';
  }
}
