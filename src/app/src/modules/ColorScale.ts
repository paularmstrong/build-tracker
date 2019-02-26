/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { interpolateMagma, interpolateRainbow, interpolateRdYlGn } from 'd3-scale-chromatic';
import { scaleSequential, ScaleSequential } from 'd3-scale';

interface Scales {
  [key: string]: ScaleSequential<string>;
}

const scales: Scales = Object.freeze({
  Rainbow: scaleSequential(interpolateRainbow),
  'Red to green': scaleSequential(interpolateRdYlGn),
  Magma: scaleSequential(interpolateMagma)
});

export default scales;
