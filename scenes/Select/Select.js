// @flow
import React from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import BaseService from 'vigilant-bassoon/services/Service';
import Compare from './components/Compare';
import Button from './components/Button';
import auth from 'vigilant-bassoon/lib/auth';

type StateType = { serviceA: BaseService | null, serviceB: BaseService | null };

@observer
class Root extends React.Component<{}, StateType> {
  state = {
    serviceA: null,
    serviceB: null,
  };

  selectService = (letter: 'A' | 'B', service?: ?BaseService) => {
    this.setState({ [`service${letter}`]: service });
  };

  setServiceA = this.selectService.bind(this, 'A');
  setServiceB = this.selectService.bind(this, 'B');

  render() {
    const { serviceA, serviceB } = this.state;
    return (
      <FullPageContainer>
        {serviceA && serviceB ? (
          <Compare serviceA={serviceA} serviceB={serviceB} />
        ) : (
          <ButtonContainer>
            {auth.services.map(service => (
              <Button
                key={service.constructor.name}
                service={service}
                selected={service === serviceA}
                onClick={serviceA ? this.setServiceB : this.setServiceA}
              />
            ))}
          </ButtonContainer>
        )}
      </FullPageContainer>
    );
  }
}

export default Root;

const FullPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.secondary};
  font-family: helvetica;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 60%;
  justify-content: space-around;
`;
