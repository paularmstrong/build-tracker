/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { interpolateCool, interpolateMagma, interpolateRainbow, interpolateRdYlBu } from 'd3-scale-chromatic';
import { scaleSequential, ScaleSequential } from 'd3-scale';

interface Scales {
  [key: string]: ScaleSequential<string>;
}

const scales: Scales = Object.freeze({
  Standard: scaleSequential(interpolateRdYlBu),
  Cool: scaleSequential(interpolateCool),
  Magma: scaleSequential(interpolateMagma),
  Rainbow: scaleSequential(interpolateRainbow)
});

export default scales;
