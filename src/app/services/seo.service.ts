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

const DEFAULT_DESCRIPTION =
  'In Utrecht ligt de geschiedenis voor het oprapen. Utrecht Time Machine brengt met innovatieve technieken oude tijden tot leven en plaatst ze middenin onze wereld.';
const DEFAULT_IMAGE = 'https://utrechttimemachine.nl/assets/img/about.jpg';
const BASE_URL = 'https://utrechttimemachine.nl';

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
    public unescapePipe: UnescapePipe
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
          this.generateStoryMeta(this.storyService.shownStory.getValue());
        } else {
          this.generateLocationMeta(
            this.mapService.selectedLocation.getValue()
          );
        }
        break;
      case SelectedView.About:
        this.generateAboutMeta();
        break;
      case SelectedView.Story:
        this.generateStoryMeta(this.storyService.shownStory.getValue());
        break;
      case SelectedView.Routes:
        this.generateRoutesMeta();
        break;
      case SelectedView.SelectedRoute:
        this.generateSelectedRouteMeta(
          this.utmRoutesService.selected.getValue()
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
      'https://utrechttimemachine.nl/assets/img/about.jpg'
    );
  }

  private generateAboutMeta() {
    this.setMetaTags(
      'Over – Utrecht Time Machine',
      'UTM is een consortium van Utrechtse erfgoedinstellingen. Samen willen we open data over de Utrechtse geschiedenis verbinden en presenteren in een toegankelijke vorm.',
      'https://utrechttimemachine.nl/assets/img/about.jpg'
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
      location?.image || ''
    );
  }

  private generateStoryMeta(story: Story | undefined) {
    if (!story) {
      // console.warn('No story, regenerating home');
      // this.generateHomeMeta();
      return;
    }
    this.setMetaTags(
      (this.unescapePipe.transform(story.title) || '⏳') +
        ' – Utrecht Time Machine',
      story.title,
      story.photo,
      'article'
    );
  }

  private generateRoutesMeta() {
    this.setMetaTags(
      'Routes – Utrecht Time Machine',
      'Ontdek de geschiedenis van Utrecht met deze routes. Ga op pad en ontdek de verhalen achter de stad.'
    );
  }

  private generateSelectedRouteMeta(selectedRoute: UtmRoute | undefined) {
    if (!selectedRoute) {
      // console.warn('No selected route, regenerating home');
      // this.generateHomeMeta();
      return;
    }

    this.setMetaTags(
      (selectedRoute.title || '⏳') + ' – Utrecht Time Machine',
      selectedRoute.head,
      selectedRoute.photo
    );
  }

  private setMetaTags(
    myTitle: string,
    description?: string,
    image?: string,
    type: string = 'website'
  ) {
    this.title.setTitle(myTitle);
    this.meta.updateTag({ name: 'og:title', content: myTitle });
    this.meta.updateTag({
      name: 'description',
      content: description || DEFAULT_DESCRIPTION,
    });
    this.meta.updateTag({
      name: 'og:description',
      content: description || DEFAULT_DESCRIPTION,
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
