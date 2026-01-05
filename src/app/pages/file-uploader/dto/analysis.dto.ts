export interface Artist {
  artistName: string;
  trackID: string;
}

export interface TrackYear{
  trackYear: string;
  time: number;
}

export interface ArtistAnalysis {
  artistName: string;
  artistImage: string;
  minutesListened: string;
  topTracks: any[];
  firstTrack: any;
  firstTimeListened: string;
  artistByYears: TrackYear[]
}