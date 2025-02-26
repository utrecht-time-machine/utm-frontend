import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { SelectedItemComponent } from './selected-item/selected-item.component';
import { RouterModule } from '@angular/router';
import { SelectedRouteComponent } from './selected-route/selected-route.component';
import { RouteStepsComponent } from './route-steps/route-steps.component';
import { SelectedStopModule } from './selected-stop/selected-stop.module';
import { StoryModule } from './story/story.module';
import { LicenseModule } from '../license/license.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditButtonModule } from '../edit-button/edit-button.module';
import { OrganisationsModule } from '../organisations/organisations.module';
import { ImageViewerModule } from './media-item/image-viewer/image-viewer.module';
import { AudioPlayerModule } from '../audio-player/audio-player.module';
import { ThemeFilterModule } from '../filters/filter-expanded/theme-filter/theme-filter.module';
import { FiltersModule } from '../filters/filters.module';
import { TimeFilterModule } from '../filters/filter-expanded/time-filter/time-filter.module';

@NgModule({
  declarations: [
    MapComponent,
    SelectedItemComponent,
    SelectedRouteComponent,
    RouteStepsComponent,
  ],
  exports: [MapComponent],
  imports: [
    CommonModule,
    RouterModule,
    SelectedStopModule,
    StoryModule,
    LicenseModule,
    TranslateModule,
    EditButtonModule,
    OrganisationsModule,
    ImageViewerModule,
    AudioPlayerModule,
    ThemeFilterModule,
    TimeFilterModule,
    FiltersModule,
  ],
})
export class MapModule {}
