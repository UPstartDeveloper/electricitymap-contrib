import moment from 'moment';

import { dispatch, dispatchApplication } from '../store';


export function createGraphBackgroundMouseMoveHandler() {
  return (timeIndex) => {
    dispatchApplication('selectedZoneTimeIndex', timeIndex);
  };
}

export function createGraphBackgroundMouseOutHandler() {
  return () => {
    dispatchApplication('selectedZoneTimeIndex', null);
  };
}

function setLayerTooltip(isMobile, timeIndex, layer, ev, svgRef) {
  if (layer.datapoints[timeIndex]) {
    dispatch({
      type: 'SHOW_TOOLTIP',
      payload: {
        displayMode: layer.key,
        // If in mobile mode, put the tooltip to the top of the screen for
        // readability, otherwise float it depending on the cursor position.
        position: !isMobile
          ? { x: ev.clientX - 7, y: svgRef.current.getBoundingClientRect().top - 7 }
          : { x: 0, y: 0 },
        zoneData: layer.datapoints[timeIndex].data._countryData,
      },
    });
  }
}

export function createGraphLayerMouseMoveHandler(isMobile, setSelectedLayerIndex) {
  return (timeIndex, layerIndex, layer, ev, svgRef) => {
    if (setSelectedLayerIndex) {
      setSelectedLayerIndex(layerIndex);
    }
    setLayerTooltip(isMobile, timeIndex, layer, ev, svgRef);
    dispatchApplication('selectedZoneTimeIndex', timeIndex);
  };
}

export function createGraphLayerMouseOutHandler(setSelectedLayerIndex) {
  return () => {
    if (setSelectedLayerIndex) {
      setSelectedLayerIndex(null);
    }
    dispatch({ type: 'HIDE_TOOLTIP' });
    dispatchApplication('selectedZoneTimeIndex', null);
  };
}

//
// The following two handlers are for showing the tooltip over the first layer
// when hovering over empty graph background, which is a desired behaviour if
// we know the graph is always going to have only one layer.
//

export function createSingleLayerGraphBackgroundMouseMoveHandler(isMobile, setSelectedLayerIndex) {
  return (timeIndex, layers, ev, svgRef) => {
    if (setSelectedLayerIndex) {
      setSelectedLayerIndex(0);
    }
    setLayerTooltip(isMobile, timeIndex, layers[0], ev, svgRef);
    dispatchApplication('selectedZoneTimeIndex', timeIndex);
  };
}

export function createSingleLayerGraphBackgroundMouseOutHandler(setSelectedLayerIndex) {
  return () => {
    if (setSelectedLayerIndex) {
      setSelectedLayerIndex(null);
    }
    dispatch({ type: 'HIDE_TOOLTIP' });
    dispatchApplication('selectedZoneTimeIndex', null);
  };
}
