// @flow
import Service from './Service';
import fetch from 'isomorphic-fetch';
import { Dropbox } from 'dropbox';

const splitArtists = (artist: ?string): string[] => {
  if (!artist) {
    return [];
  }

  // eslint-disable-next-line no-control-regex
  artist = artist.replace(/[^\x00-\x7F]/g, '').toLowerCase();

  if (artist.includes('&')) {
    return artist.split('&').map(a => a.trim());
  }

  if (artist.includes('/')) {
    return artist.split('/').map(a => a.trim());
  }

  if (artist.includes(',')) {
    return artist.split(',').map(a => a.trim());
  }

  if (artist.includes('+')) {
    return artist.split('+').map(a => a.trim());
  }

  if (artist.includes('-')) {
    return artist.split('-').map(a => a.trim());
  }

  if (artist.includes('featuring')) {
    return artist.split('featuring').map(a => a.trim());
  }

  if (artist.includes('feat.')) {
    return artist.split('feat.').map(a => a.trim());
  }

  return [artist.trim()];
};

export default class Traktor extends Service {
  client: Dropbox;
  constructor() {
    const CLIENT_ID = 'ui58rnq623hn2c0';
    super(CLIENT_ID);

    this.client = new Dropbox({
      clientId: this.clientId,
      fetch,
      accessToken: this.accessToken,
    });

    if (this.accessToken) {
      this.fetch();
    }
  }

  get oauthUri() {
    return this.client.getAuthenticationUrl(this.redirectUri);
  }

  _handleAuthorize = (hash: Object) => {
    const { access_token } = hash;

    if (typeof access_token === 'string') {
      this.client.setAccessToken(access_token);
      return access_token;
    }

    return null;
  };

  _fetch = async () => {
    const results = await this.client.filesDownload({
      path: '/collection.nml',
    });

    const reader = new FileReader();
    const loadFinished = new Promise(resolve => {
      reader.addEventListener('loadend', ({ srcElement }: ProgressEvent) => {
        // $FlowFixMe wat
        const { result } = srcElement;
        if (typeof result === 'string') {
          resolve(result);
        }
      });
    });

    reader.readAsText(results.fileBlob);
    const parser = new DOMParser();
    const parsedXml = parser.parseFromString(await loadFinished, 'text/xml');

    const entries = Array.from(parsedXml.getElementsByTagName('ENTRY'));
    this.tracks =
      entries.map(entry => {
        const title = entry.getAttribute('TITLE') || '';
        const album = entry.getAttribute('ALBUM') || '';
        const artist = entry.getAttribute('ARTIST');
        return {
          title,
          album,
          artists: splitArtists(artist),
        };
      }) || [];
    window.parsedXml = parsedXml;
  };
}
