/**
 * Copyright (c) 2019 Paul Armstrong
 */
import HeartIcon from '../../icons/Heart';
import React from 'react';
import TextField from '../TextField';
import { TextInput } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('TextField', () => {
  describe('leadingIcon', () => {
    test('renders an icon', () => {
      const { queryAllByType } = render(<TextField label="tacos" leadingIcon={HeartIcon} />);
      expect(queryAllByType(HeartIcon)).toHaveLength(1);
    });
  });

  describe('trailingIcon', () => {
    test('renders an icon', () => {
      const { queryAllByType } = render(<TextField label="tacos" trailingIcon={HeartIcon} />);
      expect(queryAllByType(HeartIcon)).toHaveLength(1);
    });
  });

  describe('helpText', () => {
    test('renders the help text', () => {
      const { queryAllByText } = render(<TextField label="tacos" helpText="this is help" />);
      expect(queryAllByText('this is help')).toHaveLength(1);
    });
  });

  describe('onBlur', () => {
    test('is fired for when the TextInput is blurred', () => {
      const handleBlur = jest.fn();
      const { getByType } = render(<TextField label="tacos" onBlur={handleBlur} />);
      fireEvent(getByType(TextInput), 'blur');
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    test('is fired for when the TextInput is focused', () => {
      const handleFocus = jest.fn();
      const { getByType } = render(<TextField label="tacos" onFocus={handleFocus} />);
      fireEvent(getByType(TextInput), 'focus');
      expect(handleFocus).toHaveBeenCalled();
    });
  });

  describe('onChangeText', () => {
    test('is fired for when the TextInput content changes', () => {
      const handleChangeText = jest.fn();
      const { getByType } = render(<TextField label="tacos" onChangeText={handleChangeText} />);
      fireEvent.changeText(getByType(TextInput), 'burritos');
      expect(handleChangeText).toHaveBeenCalledWith('burritos');
    });
  });
});
