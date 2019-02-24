import React from 'react';
import { interpolateMagma, interpolateRainbow, interpolateRdYlGn } from 'd3-scale-chromatic';
import { scaleSequential, ScaleSequential } from 'd3-scale';

interface Scales {
  [key: string]: ScaleSequential<string>;
}

export const scales: Scales = {
  Rainbow: scaleSequential(interpolateRainbow),
  'Red to green': scaleSequential(interpolateRdYlGn),
  Magma: scaleSequential(interpolateMagma)
};

const context = React.createContext<ScaleSequential<string>>(scales.Rainbow);

export default context;
