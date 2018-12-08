// @flow
import * as React from 'react';
import styled from 'styled-components';
import { transparentize, darken, lighten } from 'polished';
import type BaseService from '../services/Service';

type PropsType = {
  service: BaseService,
  onClick: (?BaseService) => void,
  selected: boolean,
};

class Button extends React.Component<PropsType> {
  authorizeService = () => {
    window.location = this.props.service.oauthUri;
  };

  handleClick = () => {
    const { onClick, selected, service } = this.props;

    if (!service.accessToken) {
      this.authorizeService();
      return;
    }

    onClick(selected ? null : service);
  };

  get action(): string {
    const { service, selected } = this.props;
    if (!service.accessToken) {
      return 'Authorize';
    }

    if (selected) {
      return 'Comparing';
    }

    return 'Compare';
  }

  render() {
    const { service, selected } = this.props;
    return (
      <StyledButton onClick={this.handleClick} selected={selected}>
        <Action>{this.action}</Action>
        <Name>{service.constructor.name}</Name>
      </StyledButton>
    );
  }
}

const StyledButton = styled.div.attrs({ role: 'button' })`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-select: none;
  padding: 20px 40px;
  border-radius: 3px;
  min-width: 120px;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: ${({ theme, selected }) =>
    selected ? lighten(0.25, theme.action) : darken(0.025, theme.action)}
  border: 1px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => transparentize(0.8, theme.text)};
`;

const Action = styled.h2`
  font-family: Helvetica;
  font-weight: 200;
  margin: 0;
  font-size: 20px;
`;

const Name = styled.h1`
  font-family: Helvetica;
  font-weight: 800;
  margin: 15px 0 0;
  font-size: 40px;
`;

export default Button;
