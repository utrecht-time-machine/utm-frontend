import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss'],
  standalone: false,
})
export class EditButtonComponent {
  @Input() nid: string | undefined;

  environment = environment;

  constructor(private platform: PlatformService) {}

  shouldBeShown(): boolean {
    if (this.platform.isBrowser()) {
      return (
        environment.dev ||
        window.localStorage.getItem('utrechtTimeMachineDev') === 'true'
      );
    }

    return environment.dev;
  }
}
