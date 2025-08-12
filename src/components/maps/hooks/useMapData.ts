import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

export interface Location {
  lat: number;
  lng: number;
  tilesetId: string;
  layerName: string;
  isTimeSeries?: boolean;
}

export const useMapData = (initialCenter: [number, number], initialZoom: number) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [layerType, setLayerType] = useState<'footprint' | 'pm25'>('footprint');
  const [currentFootprintThreshold, setCurrentFootprintThreshold] = useState(0.0002);
  const [currentPm25Threshold, setCurrentPm25Threshold] = useState(0.01);
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDate, setCurrentDate] = useState('20160801');

  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const markersRef = useRef<
    {
      marker: mapboxgl.Marker;
      element: HTMLDivElement;
      location: Location;
    }[]
  >([]);

  const handleLayerChange = (type: 'footprint' | 'pm25') => {
    setLayerType(type);
    if (mapRef.current && mapRef.current.getStyle()) {
      if (mapRef.current.getLayer('footprint-layer')) {
        mapRef.current.setLayoutProperty(
          'footprint-layer',
          'visibility',
          type === 'footprint' ? 'visible' : 'none'
        );
      }

      if (mapRef.current.getLayer('pm25-layer')) {
        mapRef.current.setLayoutProperty(
          'pm25-layer',
          'visibility',
          type === 'pm25' ? 'visible' : 'none'
        );
      }
    }
  };

  const handleThresholdChange = (type: 'increase' | 'decrease') => {
    if (layerType === 'footprint') {
      const newThreshold =
        type === 'increase' ? currentFootprintThreshold * 2 : currentFootprintThreshold / 2;

      setCurrentFootprintThreshold(newThreshold);

      if (mapRef.current && mapRef.current.getLayer('footprint-layer')) {
        updateFootprintFilter(newThreshold);
      }
    } else {
      const newThreshold =
        type === 'increase' ? currentPm25Threshold * 2 : currentPm25Threshold / 2;

      setCurrentPm25Threshold(newThreshold);

      if (mapRef.current && mapRef.current.getLayer('pm25-layer')) {
        updatePm25Filter(newThreshold);
      }
    }
  };

  const updateFootprintFilter = (threshold: number) => {
    if (!mapRef.current || !selectedLocation) return;

    const formattedDate = `${currentDate.substring(0, 4)}-${currentDate.substring(4, 6)}-${currentDate.substring(6, 8)}`;

    let filter;
    if (selectedLocation.isTimeSeries) {
      if (selectedLocation.layerName === 'layer_type') {
        filter = [
          'all',
          ['==', ['get', 'layer_type'], 'footprint'],
          ['>', ['get', 'value'], threshold],
          ['==', ['get', 'date'], formattedDate],
        ];
      } else {
        filter = [
          'all',
          ['>', ['get', 'value'], threshold],
          ['==', ['get', 'date'], formattedDate],
        ];
      }
    } else {
      filter = ['>', ['coalesce', ['get', 'footprint'], 0], threshold];
    }

    mapRef.current.setFilter('footprint-layer', filter);
  };

  const updatePm25Filter = (threshold: number) => {
    if (!mapRef.current || !selectedLocation) return;

    const formattedDate = `${currentDate.substring(0, 4)}-${currentDate.substring(4, 6)}-${currentDate.substring(6, 8)}`;

    let filter;
    if (selectedLocation.isTimeSeries) {
      if (selectedLocation.layerName === 'layer_type') {
        filter = [
          'all',
          ['==', ['get', 'layer_type'], 'convolved'],
          ['>', ['get', 'pm25_value'], threshold],
          ['==', ['get', 'date'], formattedDate],
        ];
      } else {
        filter = ['>', ['get', 'pm25'], threshold];
      }
    } else {
      filter = ['>', ['get', 'pm25'], threshold];
    }

    mapRef.current.setFilter('pm25-layer', filter);
  };

  const toggleAnimation = () => {
    if (isPlaying) {
      stopAnimation();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const resetView = () => {
    if (mapRef.current) {
      if (mapRef.current.getLayer('footprint-layer')) {
        mapRef.current.removeLayer('footprint-layer');
      }

      if (mapRef.current.getLayer('pm25-layer')) {
        mapRef.current.removeLayer('pm25-layer');
      }

      if (mapRef.current.getSource('footprint-data')) {
        mapRef.current.removeSource('footprint-data');
      }

      mapRef.current.jumpTo({
        center: initialCenter,
        zoom: initialZoom,
      });
    }

    stopAnimation();
    setSelectedLocation(null);
  };

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, []);

  return {
    selectedLocation,
    setSelectedLocation,
    layerType,
    handleLayerChange,
    currentFootprintThreshold,
    currentPm25Threshold,
    handleThresholdChange,
    updateFootprintFilter,
    updatePm25Filter,
    isPlaying,
    toggleAnimation,
    stopAnimation,
    currentDate,
    setCurrentDate,
    currentZoom,
    setCurrentZoom,
    resetView,
    mapRef,
    animationRef,
    isPlayingRef,
    markersRef,
  };
};

export default useMapData;
