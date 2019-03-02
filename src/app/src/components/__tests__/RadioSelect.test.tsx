/**
 * Copyright (c) 2019 Paul Armstrong
 */
import RadioSelect from '../RadioSelect';
import React from 'react';
import { fireEvent, render } from 'react-testing-library';

describe('RadioSelect', () => {
  describe('render', () => {
    test('renders a hidden input', () => {
      const { getByRole } = render(<RadioSelect value={true} />);
      expect(getByRole('checkbox').style).toMatchObject({
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        opacity: '0'
      });
    });
  });

  describe('onFocus', () => {
    test('calls the onFocus callback', () => {
      const handleFocus = jest.fn();
      const { getByRole } = render(<RadioSelect onFocus={handleFocus} value={true} />);
      fireEvent.focus(getByRole('checkbox'));
      expect(handleFocus).toHaveBeenCalled();
    });

    test('makes the faux input visually focused', () => {
      const { getByRole, getByTestId } = render(<RadioSelect value={true} />);
      // @ts-ignore
      expect(getByTestId('fauxRadio').children[0].style).toMatchObject({
        'background-color': 'rgb(178, 178, 178)'
      });
      fireEvent.focus(getByRole('checkbox'));
      // @ts-ignore
      expect(getByTestId('fauxRadio').children[0].style).toMatchObject({
        'background-color': 'rgb(61, 109, 162)'
      });
    });
  });

  describe('onBlur', () => {
    test('calls the onBlur callback', () => {
      const handleBlur = jest.fn();
      const { getByRole } = render(<RadioSelect onBlur={handleBlur} value={true} />);
      fireEvent.blur(getByRole('checkbox'));
      expect(handleBlur).toHaveBeenCalled();
    });

    test('makes the faux input visually unfocused', () => {
      const { getByRole, getByTestId } = render(<RadioSelect value={true} />);
      fireEvent.focus(getByRole('checkbox'));
      fireEvent.blur(getByRole('checkbox'));
      // @ts-ignore
      expect(getByTestId('fauxRadio').children[0].style).toMatchObject({
        'background-color': 'rgb(178, 178, 178)'
      });
    });
  });

  describe('onChange', () => {
    test('calls the onValueChange callback', () => {
      const handleValueChange = jest.fn();
      const { getByRole } = render(<RadioSelect onValueChange={handleValueChange} value={true} />);
      fireEvent.click(getByRole('checkbox'));
      expect(handleValueChange).toHaveBeenCalledWith(false);
    });
  });
});
