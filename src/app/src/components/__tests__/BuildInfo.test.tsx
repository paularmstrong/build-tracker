/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Build from '@build-tracker/build';
import BuildInfo from '../BuildInfo';
import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';

const build = new Build({ revision: '1234565', parentRevision: 'abcdef', timestamp: 123 }, []);

describe('BuildInfo', () => {
  test('can be closed', () => {
    const handleClose = jest.fn();
    const { getByProps } = render(<BuildInfo build={build} onClose={handleClose} />);
    fireEvent.press(getByProps({ title: 'Close' }));
    expect(handleClose).toHaveBeenCalledWith('1234565');
  });
});
