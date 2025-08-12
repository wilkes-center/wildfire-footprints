import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../styles/theme';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const StyledContainer = styled.div<ContainerProps>`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;

  max-width: ${props => {
    switch (props.maxWidth) {
      case 'sm':
        return breakpoints.sm;
      case 'md':
        return breakpoints.md;
      case 'lg':
        return breakpoints.lg;
      case 'xl':
        return breakpoints.xl;
      default:
        return breakpoints.lg;
    }
  }};

  @media (max-width: ${breakpoints.sm}) {
    padding: 0 0.5rem;
  }
`;

export const Container: React.FC<ContainerProps> = ({ children, maxWidth = 'lg', className }) => {
  return (
    <StyledContainer maxWidth={maxWidth} className={className}>
      {children}
    </StyledContainer>
  );
};

export default Container;
