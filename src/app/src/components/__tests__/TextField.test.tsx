import React from 'react';
import TextField from '../TextField';
import { TextInput } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('TextField', () => {
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
