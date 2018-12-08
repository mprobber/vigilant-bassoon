// @flow
import uuid from 'uuid';
import { observable, action, computed } from 'mobx';
import { parse } from 'query-string';

type TrackType = { artists: string[], album: string, title: string };

export default class Service {
  clientId: string;
  @observable
  tracks: TrackType[] = [];
  @observable
  loading: boolean = false;

  constructor(clientId: string) {
    this.clientId = clientId;
    if (!this.stateToken) {
      this.generateStateToken();
    }
  }

  get accessToken(): ?string {
    return localStorage.getItem(`${this.constructor.name}-jwt-token`);
  }

  set accessToken(token: string) {
    localStorage.setItem(`${this.constructor.name}-jwt-token`, token);
  }

  get stateToken(): ?string {
    return localStorage.getItem(`${this.constructor.name}-state-token`);
  }

  set stateToken(token: string) {
    localStorage.setItem(`${this.constructor.name}-state-token`, token);
  }

  @action
  fetch = async () => {
    if (this.loading) {
      return;
    }

    this.loading = true;
    await this._fetch();
    this.loading = false;
  };

  _fetch = () => {
    throw new Error('fetch must be implemented on parent class');
  };

  generateStateToken = () => {
    this.stateToken = uuid.v4();
  };

  get redirectUri(): string {
    const { location } = window;
    return `${location.protocol}//${location.host}${
      location.pathname
    }authorize/${this.constructor.name}`;
  }

  get oauthUri(): string {
    throw new Error('Implement on service child class');
  }

  handleAuthorize(): boolean {
    const hash = parse(window.location.hash);
    const queryParams = parse(window.location.queryParams);
    const accessToken = this._handleAuthorize(hash, queryParams);

    if (!accessToken) {
      return false;
    }

    this.accessToken = accessToken;
    return true;
  }

  _handleAuthorize: (Object, Object) => ?string = () => {
    throw new Error('Implement on service child class');
  };

  @computed
  get tracksByArtist() {
    const byArtist = {};

    if (!this.tracks) {
      return byArtist;
    }
    this.tracks.forEach(track => {
      track.artists.forEach(a => {
        const artistTracks = byArtist[a] || new Set();

        artistTracks.add(track);

        byArtist[a] = artistTracks;
      });
    });

    return byArtist;
  }

  @computed
  get tracksByTrackTitle() {
    const tracks = {};
    this.tracks.forEach(track => {
      if (track.title) {
        tracks[
          track.title
            // eslint-disable-next-line no-control-regex
            .replace(/[^\x00-\x7F]/g, '')
            .toLowerCase()
            .trim()
        ] = track;
      }
    });

    return tracks;
  }
}
