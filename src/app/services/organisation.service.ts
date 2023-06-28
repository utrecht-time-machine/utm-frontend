import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Organisation } from '../models/organisation';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtmTranslateService } from './utm-translate.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
  all: BehaviorSubject<Organisation[]> = new BehaviorSubject<Organisation[]>(
    []
  );

  constructor(
    private http: HttpClient,
    private utmTranslate: UtmTranslateService
  ) {
    void this._loadAll();
  }

  private async _loadAll() {
    const allOrganisations: Organisation[] = await this.getOrganisations();
    this.all.next(allOrganisations);
  }

  public getByIds(organisationIds: string[]): Organisation[] | undefined {
    const allOrganisations = this.all.getValue();
    const filteredOrganisations = allOrganisations.filter((org) =>
      organisationIds.includes(org.id)
    );
    return filteredOrganisations.length > 0 ? filteredOrganisations : undefined;
  }

  public async getOrganisations(): Promise<Organisation[]> {
    const organisations: Organisation[] = await lastValueFrom(
      this.http.get<Organisation[]>(
        environment.apiUrl + environment.apiSuffixes.organisations
      )
    );

    UtilService.addUrlPrefixes(organisations, 'logo');
    this.utmTranslate.translateObjectsByKeys(
      organisations,
      environment.translateKeys.organisation
    );
    return organisations;
  }
}
