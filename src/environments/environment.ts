export const environment = {
  apiUrl: 'https://dev-data.utrechttimemachine.nl/rest/',
  imageBaseUrl: 'https://dev-data.utrechttimemachine.nl',
  audioBaseUrl: 'https://dev-data.utrechttimemachine.nl',
  apiSuffixes: {
    mapLocations: 'all_locations',
    locationDetailsById: 'location_details?nid=',
    storyDetailsById: 'story_details?nid=',
    storiesByLocationId: 'stories_by_location?nid=',
    organisationsByLocation: 'organisations_by_location?nid=',
    routes: 'routes',
    stopsByRoute: 'stops_by_route?nid=',
    mediaByStory: 'media_by_story?nid=',
  },
  aliasToNidUrl: 'https://dev-data.utrechttimemachine.nl/alias_to_nid?alias=',
  mediaItemImageExtensions: ['.png', '.jpg'],
  mediaItemAudioExtensions: ['.mp3', '.ogg'],
  mediaItemYouTubePrefixToRemove: [
    'https://www.youtube.com/watch?v=',
    'https://youtu.be/',
  ],
  mapboxAccessToken:
    'pk.eyJ1IjoiY2Itc3R1ZGlvIiwiYSI6ImNrcDUxZW04MjBjZ3gydHF0bmUyano0bncifQ.MLaKn3TF2V4b4ICX1HJnnA',
  liveSearchUrl:
    'https://dev-data.utrechttimemachine.nl/search_api_autocomplete/utm_search?display=livesearch&filter=livesearch&q=',
  translateUrl: 'https://services.utrechttimemachine.nl/translate',
  translateKeys: {
    routes: ['head', 'teaser', 'title'],
    locationDetails: ['caption', 'teaser', 'head', 'title', 'text'],
    storyDetails: ['title', 'location_title'],
    mediaItem: ['title', 'caption', 'text'],
    stop: ['title'],
    organisation: ['title'],
    mapLocation: ['title', 'head'],
  },
};
