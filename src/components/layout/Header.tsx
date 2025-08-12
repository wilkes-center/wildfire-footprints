import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, typography, spacing, shadows } from '../../styles/theme';
import WildfireIcon from '../../assets/wildfire-icon.svg';

const HeaderContainer = styled.header`
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid ${colors.borderSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.snowbirdWhite};
  box-shadow: ${shadows.sm};
`;

const Logo = styled.div`
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.bold};
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  a {
    text-decoration: none;
    color: ${colors.moabMahogany};
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    gap: ${spacing.sm};

    &:hover {
      color: ${colors.greatSaltLakeGreen};
    }
  }
`;

const IconContainer = styled.img`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: ${spacing.lg};
    margin: 0;
    padding: 0;
  }

  li a {
    text-decoration: none;
    color: ${colors.olympicParkObsidian};
    font-weight: ${typography.fontWeights.medium};
    transition: color 0.2s ease;
    font-family: ${typography.fontFamily};
    font-size: ${typography.sizes.body};

    &:hover {
      color: ${colors.moabMahogany};
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Link to="/">
          <IconContainer src={WildfireIcon} alt="Wildfire Icon" />
          Wildfire Footprint Visualizer
        </Link>
      </Logo>

      <Nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/">Map</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
