import { Component } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';

@Component({
    selector: 'app-connectivity',
    templateUrl: './connectivity.component.html',
    styleUrls: ['./connectivity.component.scss'],
    standalone: false
})
export class ConnectivityComponent {
  constructor(public connectivity: ConnectivityService) {}
}
