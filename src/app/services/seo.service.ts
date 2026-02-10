import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { Meta, Title } from '@angular/platform-browser';
import { SelectedView } from '../models/selected-view';
import { LocationDetails } from '../models/location-details';
import { RoutingService } from './routing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Story } from '../models/story';
import { StoryService } from './story.service';
import { debounceTime, mergeWith } from 'rxjs';
import { UtmRoutesService } from './utm-routes.service';
import { UtmRoute } from '../models/utm-route';
import { UnescapePipe } from '../pipes/unescape.pipe';
import { MediaItem } from '../models/media-item';
import { UtmTranslateService } from './utm-translate.service';

const DEFAULT_DESCRIPTION =
  'In Utrecht ligt de geschiedenis voor het oprapen. Utrecht Time Machine brengt met innovatieve technieken oude tijden tot leven en plaatst ze middenin onze wereld.';
const DEFAULT_IMAGE = 'https://utrechttimemachine.nl/assets/img/about.jpg';
const BASE_URL = 'https://utrechttimemachine.nl';
const DESC_MAX_LENGTH = 150;

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    public meta: Meta,
    public title: Title,
    public mapService: MapService,
    public routing: RoutingService,
    public router: Router,
    public storyService: StoryService,
    public utmRoutesService: UtmRoutesService,
    public route: ActivatedRoute,
    public unescapePipe: UnescapePipe,
    public utmTranslate: UtmTranslateService,
  ) {
    // Listen to changes in url and the data being loaded
    // Handle delayed loading of SEO-required data by debouncing
    routing.selectedView
      .pipe(mergeWith(this.mapService.selectedLocation))
      .pipe(mergeWith(this.storyService.shownStory))
      .pipe(mergeWith(this.utmRoutesService.selected))
      .pipe(debounceTime(50))
      .subscribe(() => {
        this.handleUpdate();
      });
  }

  private handleUpdate() {
    const selectedView = this.routing.selectedView.getValue();
    // console.log('Updating SEO', selectedView); // DEBUG
    switch (selectedView) {
      case SelectedView.Locations:
        const isHomePage = this.router.url === '/';
        // Also check if story is loaded on top of location
        const storyQueryParam = this.route.snapshot.queryParamMap.get('story');
        if (isHomePage) {
          this.generateHomeMeta();
        } else if (storyQueryParam) {
          this.generateStoryMeta(
            this.storyService.shownStory.getValue(),
            this.storyService.shownStory.getValue()?.mediaItems,
          );
        } else {
          this.generateLocationMeta(
            this.mapService.selectedLocation.getValue(),
          );
        }
        break;
      case SelectedView.About:
        this.generateAboutMeta();
        break;
      case SelectedView.Story:
        this.generateStoryMeta(
          this.storyService.shownStory.getValue(),
          this.storyService.shownStory.getValue()?.mediaItems,
        );
        break;
      case SelectedView.Routes:
        this.generateRoutesMeta();
        break;
      case SelectedView.SelectedRoute:
        this.generateSelectedRouteMeta(
          this.utmRoutesService.selected.getValue(),
        );
        break;
      case SelectedView.Undefined:
      default:
        this.generateHomeMeta();
    }
  }

  private generateHomeMeta() {
    this.setMetaTags(
      'Utrecht Time Machine',
      DEFAULT_DESCRIPTION,
      'https://utrechttimemachine.nl/assets/img/about.jpg',
    );
  }

  private generateAboutMeta() {
    this.setMetaTags(
      'Over – Utrecht Time Machine',
      'UTM is een consortium van Utrechtse erfgoedinstellingen. Samen willen we open data over de Utrechtse geschiedenis verbinden en presenteren in een toegankelijke vorm.',
      'https://utrechttimemachine.nl/assets/img/about.jpg',
    );
  }

  private generateLocationMeta(location: LocationDetails | undefined) {
    if (!location) {
      // console.warn('No location, regenerating home');
      // this.generateHomeMeta();
      return;
    }
    this.setMetaTags(
      (location?.title || '⏳') + ' – Utrecht Time Machine',
      location?.teaser,
      location?.image || '',
    );
  }

  private generateStoryMeta(
    story: Story | undefined,
    mediaItems: MediaItem[] | undefined,
  ) {
    if (!story || !mediaItems) {
      // console.warn('No story, regenerating home');
      // this.generateHomeMeta();
      return;
    }

    // Description extraction from media item
    const title = this.utmTranslate.getAsEnglishIfApplicable(
      story,
      'title',
      'title_english',
    );
    let description = title;
    if (mediaItems && mediaItems[0] && mediaItems[0].text) {
      description = mediaItems[0].text.replace(/<[^>]+>/g, '').trim();
    }

    this.setMetaTags(
      (title || '⏳') + ' – Utrecht Time Machine',
      description,
      story.photo,
      'article',
    );
  }

  private generateRoutesMeta() {
    this.setMetaTags(
      'Routes – Utrecht Time Machine',
      'Ontdek de geschiedenis van Utrecht met deze routes. Ga op pad en ontdek de verhalen achter de stad.',
    );
  }

  private generateSelectedRouteMeta(selectedRoute: UtmRoute | undefined) {
    if (!selectedRoute) {
      // console.warn('No selected route, regenerating home');
      // this.generateHomeMeta();
      return;
    }

    const title = this.utmTranslate.getAsEnglishIfApplicable(
      selectedRoute,
      'title',
      'title_english',
    );
    this.setMetaTags(
      (title || '⏳') + ' – Utrecht Time Machine',
      selectedRoute.head,
      selectedRoute.photo,
    );
  }

  private preProcessDescription(description: string): string {
    if (description.length > DESC_MAX_LENGTH) {
      return description.substring(0, DESC_MAX_LENGTH - 3) + '...';
    } else {
      return description;
    }
  }

  private setMetaTags(
    myTitle: string,
    description?: string,
    image?: string,
    type: string = 'website',
  ) {
    this.title.setTitle(this.unescapePipe.transform(myTitle));
    this.meta.updateTag({
      name: 'og:title',
      content: this.unescapePipe.transform(myTitle),
    });
    this.meta.updateTag({
      name: 'description',
      content: description
        ? this.preProcessDescription(description)
        : DEFAULT_DESCRIPTION,
    });
    this.meta.updateTag({
      name: 'og:description',
      content: description
        ? this.preProcessDescription(description)
        : DEFAULT_DESCRIPTION,
    });
    this.meta.updateTag({
      name: 'og:image',
      content: image || DEFAULT_IMAGE,
    });
    this.meta.updateTag({
      name: 'og:url',
      content: BASE_URL + this.router.url,
    });
    this.meta.updateTag({ name: 'og:type', content: type });
  }
}
