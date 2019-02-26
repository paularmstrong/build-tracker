/**
 * Copyright (c) 2019 Paul Armstrong
 */
export enum Color {
  // https://www.colorbox.io/#steps=8#hue_start=340#hue_end=340#hue_curve=easeInQuad#sat_start=5#sat_end=100#sat_curve=easeInOutQuad#sat_rate=130#lum_start=100#lum_end=25#lum_curve=easeOutQuad#lock_hex=
  Primary00 = '#C7EBFF',
  Primary05 = '#BDE4FA',
  Primary10 = '#B3DCF4',
  Primary20 = '#80B1D6',
  Primary30 = '#3D6DA2',
  Primary40 = '#12346C',
  Primary50 = '#031A4B',
  Primary60 = '#001340',
  // https://www.colorbox.io/#steps=7#hue_start=276#hue_end=292#hue_curve=easeInOutQuad#sat_start=22#sat_end=100#sat_curve=easeInOutQuad#sat_rate=100#lum_start=100#lum_end=25#lum_curve=easeInOutQuad#minor_steps_map=0
  Secondary00 = '#E9C7FF',
  Secondary05 = '#E2BDFA',
  Secondary10 = '#DBB3F4',
  Secondary20 = '#B980D6',
  Secondary30 = '#883DA2',
  Secondary40 = '#5B126C',
  Secondary50 = '#40034B',
  Secondary60 = '#370040',
  // https://www.colorbox.io/#steps=8#hue_start=340#hue_end=340#hue_curve=easeInQuad#sat_start=0#sat_end=0#sat_curve=easeInOutQuad#sat_rate=130#lum_start=100#lum_end=0#lum_curve=easeOutQuad#lock_hex=
  White = '#FFFFFF',
  Black = '#000000',
  Gray00 = '#ffffff',
  Gray05 = '#f8f8f8',
  Gray10 = '#ebebeb',
  Gray20 = '#d4d4d4',
  Gray30 = '#b2b2b2',
  Gray40 = '#828282',
  Gray50 = '#444444',
  Gray60 = '#000000'
}

export enum TextColor {
  Primary00 = '#000000',
  Primary05 = '#000000',
  Primary10 = '#000000',
  Primary20 = '#000000',
  Primary30 = '#FFFFFF',
  Primary40 = '#FFFFFF',
  Primary50 = '#FFFFFF',
  Primary60 = '#FFFFFF',
  Secondary00 = '#000000',
  Secondary05 = '#000000',
  Secondary10 = '#000000',
  Secondary20 = '#000000',
  Secondary30 = '#FFFFFF',
  Secondary40 = '#FFFFFF',
  Secondary50 = '#FFFFFF',
  Secondary60 = '#FFFFFF',
  White = '#000000',
  Black = '#FFFFFF',
  Gray00 = '#000000',
  Gray05 = '#000000',
  Gray10 = '#000000',
  Gray20 = '#000000',
  Gray30 = '#000000',
  Gray40 = '#000000',
  Gray50 = '#FFFFFF',
  Gray60 = '#FFFFFF'
}

export enum BorderRadius {
  None = 0,
  Small = 2,
  Normal = 4,
  Infinite = 9999
}

export enum FontSize {
  Jumbo = '4rem',
  Xxlarge = '3.5rem',
  Xlarge = '2.5rem',
  Large = '1.75rem',
  Medium = '1.5rem',
  Normal = '1rem',
  Small = '0.85rem',
  Xsmall = '0.7rem'
}

export enum LineHeight {
  Normal = 1.4
}

export enum FontWeight {
  Normal = '400',
  Bold = '700'
}

export enum Breakpoint {
  Xsmall = 599,
  Small = 1023,
  Medium = 1439,
  Large = 1919,
  Xlarge = 9999
}

export enum Spacing {
  None = 0,
  Xxsmall = '0.25rem',
  Xsmall = '0.5rem',
  Small = '0.66rem',
  Normal = '1rem',
  Large = '2rem'
}

export enum MotionTiming {
  Standard = 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  Decelerate = 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  Accelerate = 'cubic-bezier(0.4, 0.0, 1, 1)'
}
