// @flow
import { stringify } from 'query-string';
import { action } from 'mobx';
import request from 'superagent';
import Service from './Service';

export default class Spotify extends Service {
  constructor() {
    const CLIENT_ID = '2383d21deeeb4ae292907b149e440403';
    super(CLIENT_ID);

    if (this.accessToken) {
      this.fetch();
    }
  }

  get oauthUri(): string {
    const qs = stringify({
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      state: this.stateToken,
      scope: 'user-library-read',
    });
    return `https://accounts.spotify.com/authorize?${qs}`;
  }

  _handleAuthorize = (hash: Object): ?string => {
    const { access_token } = hash;
    window.location.hash = '';

    if (typeof access_token === 'string') {
      return access_token;
    }
    return null;
  };

  @action
  _fetch = async () => {
    const { accessToken } = this;
    if (!accessToken) {
      throw new Error('Spotify is unauthenticated');
    }

    let remaining = true;

    while (remaining) {
      const { body } = await request('https://api.spotify.com/v1/me/tracks')
        .query({
          limit: 50,
          offset: this.tracks.length,
        })
        .set('Authorization', `Bearer ${accessToken}`);

      this.tracks.push(
        ...body.items.map(item => ({
          title: item.track.name,
          artists: item.track.artists.map(artist => artist.name.toLowerCase()),
          album: item.track.album.name,
        })),
      );

      if (!body.next) {
        remaining = false;
      }
    }

    return this.tracks;
  };
}
