// @flow
// This file contains the logic behind a simple router that handles OAuth
import { Spotify, Traktor } from '../services';
import BaseService from '../services/Service';

class Auth {
  services: BaseService[] = [new Spotify(), new Traktor()];
  constructor() {
    this.handleAuthorize();
  }

  handleAuthorize() {
    const { pathname } = window.location;
    const { authorizingService } = this;

    if (!authorizingService) {
      return;
    }

    const pathLength = `authorize/${authorizingService.constructor.name}`
      .length;

    authorizingService.handleAuthorize();
    const newPath = pathname.slice(0, pathname.length - pathLength);
    window.location.pathname = newPath;
  }

  get authorizingService(): ?BaseService {
    const { pathname } = window.location;
    return this.services.find(service =>
      pathname.endsWith(`authorize/${service.constructor.name}`),
    );
  }
}

export default new Auth();
