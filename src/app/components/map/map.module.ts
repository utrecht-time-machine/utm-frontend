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
import { ThemeButtonModule } from '../filters/filter-button/theme-button/theme-button.module';
import { ThemeSelectModule } from '../filters/filter-expanded/theme-select/theme-select.module';
import { TimeSliderButtonModule } from '../filters/filter-button/time-slider-button/time-slider-button.module';
import { TimeSliderSelectModule } from '../filters/filter-expanded/time-slider-select/time-slider-select.module';
import { FilterButtonModule } from '../filters/filter-button/filter-button.module';
import { FiltersModule } from '../filters/filters.module';

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
    ThemeButtonModule,
    ThemeSelectModule,
    TimeSliderButtonModule,
    TimeSliderSelectModule,
    FilterButtonModule,
    FiltersModule,
  ],
})
export class MapModule {}
