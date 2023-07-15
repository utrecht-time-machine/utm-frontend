import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Organisation } from '../../models/organisation';
import { ApiService } from '../../services/api.service';
import { OrganisationService } from '../../services/organisation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(
    public router: Router,
    public apiService: ApiService,
    public organisationService: OrganisationService
  ) {}
}
