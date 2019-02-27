/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { CellType } from '@build-tracker/comparator';
import React from 'react';
import { render } from 'react-native-testing-library';
import { TextCell } from '../TextCell';
import { Td, Th } from '../../Table';

describe('TextCell', () => {
  describe('header', () => {
    test('renders as Th when true', () => {
      const { queryAllByType } = render(<TextCell cell={{ type: CellType.TEXT, text: 'tacos' }} header />);
      expect(queryAllByType(Th)).toHaveLength(1);
      expect(queryAllByType(Td)).toHaveLength(0);
    });

    test('renders as Td when false', () => {
      const { queryAllByType } = render(<TextCell cell={{ type: CellType.TEXT, text: 'tacos' }} />);
      expect(queryAllByType(Th)).toHaveLength(0);
      expect(queryAllByType(Td)).toHaveLength(1);
    });
  });
});
