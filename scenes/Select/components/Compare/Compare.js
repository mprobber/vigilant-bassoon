// @flow
import React from 'react';
import styled from 'styled-components';
import type BaseService from 'vigilant-bassoon/Services/Service';

type PropsType = { serviceA: BaseService, serviceB: BaseService };

function difference(setA, setB) {
  const _difference = new Set(setA);
  for (var elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

const Compare = ({ serviceA, serviceB }: PropsType) => {
  const serviceATitles = new Set(Object.keys(serviceA.tracksByTrackTitle));
  const serviceBTitles = new Set(Object.keys(serviceB.tracksByTrackTitle));
  const titlesOnlyInServiceB = difference(serviceBTitles, serviceATitles);
  const titlesOnlyInServiceA = difference(serviceATitles, serviceBTitles);

  const serviceAArtists = new Set(Object.keys(serviceA.tracksByArtist));
  const serviceBArtists = new Set(Object.keys(serviceB.tracksByArtist));
  const artistsOnlyInServiceB = difference(serviceBArtists, serviceAArtists);
  const artistsOnlyInServiceA = difference(serviceAArtists, serviceBArtists);

  return (
    <Container>
      <div>There are</div>
      <Header>
        <div>
          {titlesOnlyInServiceB.size} tracks found in{' '}
          {serviceB.constructor.name} that were not found in{' '}
          {serviceA.constructor.name}
        </div>
        <div>
          {titlesOnlyInServiceA.size} tracks found in{' '}
          {serviceA.constructor.name} that were not found in{' '}
          {serviceB.constructor.name}
        </div>
        <div>
          {artistsOnlyInServiceB.size} artists found in{' '}
          {serviceB.constructor.name} that were not found in{' '}
          {serviceA.constructor.name}
        </div>
        <div>
          {artistsOnlyInServiceA.size} artists found in{' '}
          {serviceA.constructor.name} that were not found in{' '}
          {serviceB.constructor.name}
        </div>
      </Header>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
`;
export default Compare;
