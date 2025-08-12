import React from 'react';
import styled from 'styled-components';
import { LayerType, Location } from '../types';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndices,
} from '../../../styles/theme';
import { Typography } from '../../common/Typography';

interface MapLegendProps {
  selectedLocation: Location | null;
  layerType: LayerType;
  currentFootprintThreshold: number;
  currentPm25Threshold: number;
}

// Styled components
const LegendContainer = styled.div`
  position: absolute;
  bottom: ${spacing.xl};
  right: ${spacing.lg};
  padding: ${spacing.md};
  background-color: ${colors.snowbirdWhite};
  color: ${colors.textPrimary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  z-index: ${zIndices.mapOverlays};
  max-width: 220px;
  border: 2px solid ${colors.moabMahogany};
  font-family: ${typography.fontFamily};
`;

const CombinedLegendContainer = styled.div`
  position: absolute;
  bottom: ${spacing.xl};
  right: ${spacing.lg};
  padding: ${spacing.md};
  background-color: ${colors.snowbirdWhite};
  color: ${colors.textPrimary};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.lg};
  z-index: ${zIndices.mapOverlays};
  max-width: 460px;
  border: 2px solid ${colors.moabMahogany};
  font-family: ${typography.fontFamily};
  display: flex;
  gap: ${spacing.md};
`;

const LegendTitle = styled.h4`
  margin: 0 0 ${spacing.sm} 0;
  font-size: ${typography.sizes.body};
  font-weight: ${typography.fontWeights.semiBold};
  border-bottom: 2px solid ${colors.moabMahogany};
  padding-bottom: ${spacing.xs};
  color: ${colors.textPrimary};
`;

const LegendGrid = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: ${spacing.xs} ${spacing.sm};
  align-items: center;
  margin-bottom: ${spacing.sm};
`;

const ColorBox = styled.span<{ color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  display: block;
  border-radius: ${borderRadius.sm};
`;

const ValueLabel = styled.span`
  font-size: 11px;
  line-height: 1.3;
`;

const CategoryLabel = styled.span`
  opacity: 0.8;
  font-size: 10px;
  display: block;
`;

// Generate footprint legend items
const generateFootprintLegendItems = (min: number, max: number) => {
  // Using logarithmic scale points instead of linear steps
  const values = [1e-7, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1, 5e-1, 8e-1];
  const legendColors = [
    colors.footprintScale[0], // Lightest for very low values
    colors.footprintScale[0],
    colors.footprintScale[0],
    colors.footprintScale[1], // Start gradient from 0.001
    colors.footprintScale[2],
    colors.footprintScale[3],
    colors.footprintScale[4],
    colors.footprintScale[5], // Darkest for highest values
  ];

  // Only show a subset of the points to keep legend compact
  const displayIndices = [0, 3, 4, 5, 6, 7]; // Show 1e-7, 1e-3, 1e-2, 1e-1, 5e-1, 8e-1

  return displayIndices.map(i => (
    <React.Fragment key={i}>
      <ColorBox color={legendColors[i]} />
      <ValueLabel>{values[i].toExponential(1)}</ValueLabel>
    </React.Fragment>
  ));
};

// Generate PM2.5 legend items
const generatePm25LegendItems = (min: number, max: number) => {
  const values = [
    min,
    Math.min(12, max * 0.1),
    Math.min(35, max * 0.35),
    Math.min(55, max * 0.55),
    Math.min(75, max * 0.75),
    max,
  ];

  const labels = [
    'Very Good',
    'Good',
    'Moderate',
    'Unhealthy for Sensitive',
    'Unhealthy',
    'Very Unhealthy',
  ];
  const legendColors = [
    colors.pm25Scale[0],
    colors.pm25Scale[1],
    colors.pm25Scale[2],
    colors.pm25Scale[3],
    colors.pm25Scale[4],
    colors.pm25Scale[5],
  ];

  return values.map((value, i) => (
    <React.Fragment key={i}>
      <ColorBox color={legendColors[i]} />
      <ValueLabel>
        {i === values.length - 1
          ? `${value.toFixed(1)}+`
          : `${value.toFixed(1)} - ${values[i + 1].toFixed(1)}`}
        <CategoryLabel>{labels[i]}</CategoryLabel>
      </ValueLabel>
    </React.Fragment>
  ));
};

export const MapLegend: React.FC<MapLegendProps> = React.memo(({
  selectedLocation,
  layerType,
  currentFootprintThreshold,
  currentPm25Threshold,
}) => {
  if (!selectedLocation) return null;

  // Define ranges for each layer type
  const footprintRange = { min: Math.max(1e-7, currentFootprintThreshold), max: 0.8 };
  const pm25Range = { min: Math.max(0, currentPm25Threshold), max: 100 };

  // For combined view, render two legends side by side
  if (layerType === 'combined') {
    return (
      <CombinedLegendContainer>
        <div>
          <LegendTitle>Footprint Scale</LegendTitle>
          <LegendGrid>
            {generateFootprintLegendItems(footprintRange.min, footprintRange.max)}
          </LegendGrid>
        </div>
        <div>
          <LegendTitle>PM2.5 Scale (μg/m³)</LegendTitle>
          <LegendGrid>{generatePm25LegendItems(pm25Range.min, pm25Range.max)}</LegendGrid>
        </div>
      </CombinedLegendContainer>
    );
  }

  // Generate the appropriate legend items based on layer type
  const legendItems =
    layerType === 'footprint'
      ? generateFootprintLegendItems(footprintRange.min, footprintRange.max)
      : generatePm25LegendItems(pm25Range.min, pm25Range.max);

  return (
    <LegendContainer>
      <LegendTitle>
        {layerType === 'footprint' ? 'Footprint Scale' : 'PM2.5 Scale (μg/m³)'}
      </LegendTitle>

      <LegendGrid>{legendItems}</LegendGrid>

      <Typography variant="caption">Values below threshold are filtered out</Typography>
    </LegendContainer>
  );
});

MapLegend.displayName = 'MapLegend';
