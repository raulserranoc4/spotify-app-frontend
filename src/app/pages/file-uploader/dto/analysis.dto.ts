export interface Artist {
  artistName: string;
  trackID: string;
}

export interface TrackYear {
  trackYear: string;
  time: number;
}

export interface TrackMonth {
  trackMonth: string;
  time: number;
}

export interface TimeDuration {
  hours: number;
  minutes: number;
  seconds: string;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyFollowers {
  href: string | null;
  total: number;
}

export interface SpotifySimpleArtist {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
}

export interface RecordArtist extends Artist {
  time: number;
  external_urls?: SpotifyExternalUrls;
  followers?: SpotifyFollowers;
  genres?: string[];
  href?: string;
  id?: string;
  images?: SpotifyImage[];
  name?: string;
  popularity?: number;
  type?: 'artist';
  uri?: string;
}

export interface DisplayRecordArtist extends Omit<RecordArtist, 'time'> {
  time: TimeDuration;
}

export interface SpotifyAlbum {
  album_type: string;
  artists: SpotifySimpleArtist[];
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: 'album';
  uri: string;
}

export interface SpotifyExternalIds {
  isrc?: string;
}

export interface RecordTrack {
  time: number;
  trackID?: string;
  trackName?: string;
  album?: SpotifyAlbum;
  artists?: SpotifySimpleArtist[];
  available_markets?: string[];
  disc_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  external_ids?: SpotifyExternalIds;
  external_urls?: SpotifyExternalUrls;
  href?: string;
  id?: string;
  is_local?: boolean;
  name?: string;
  popularity?: number;
  preview_url?: string | null;
  track_number?: number;
  type?: 'track';
  uri?: string;
}

export interface DisplayRecordTrack extends Omit<RecordTrack, 'time'> {
  time: TimeDuration;
}

export interface RecordInfoDto {
  artists: RecordArtist[];
  tracks: RecordTrack[];
  yearsInfo: TrackYear[];
  monthsInfo: TrackMonth[];
  totalArtists: Artist[];
}

export interface ArtistAnalysis {
  artistName: string;
  artistImage?: string | null;
  minutesListened: string;
  topTracks: RecordTrack[];
  firstTrack: RecordTrack | string;
  firstTimeListened: string;
  artistByYears: TrackYear[];
}
