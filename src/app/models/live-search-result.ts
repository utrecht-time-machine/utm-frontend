export interface LiveSearchResult {
  value: string;
  url: string;
  label: string;
  type?: LiveSearchResultType;
}

export type LiveSearchResultType = 'location' | 'route' | 'story';
export const liveSearchResultTypes: LiveSearchResultType[] = [
  'location',
  'route',
  'story',
];
