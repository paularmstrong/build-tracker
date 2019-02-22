import { mount } from 'enzyme';
import React from 'react';
import TextField from '../TextField';
import { TextInput } from 'react-native';

describe('TextField', () => {
  describe('onBlur', () => {
    test('is fired for when the TextInput is blurred', () => {
      const handleBlur = jest.fn();
      const wrapper = mount(<TextField label="tacos" onBlur={handleBlur} />);
      wrapper.find(TextInput).simulate('blur');
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    test('is fired for when the TextInput is focused', () => {
      const handleFocus = jest.fn();
      const wrapper = mount(<TextField label="tacos" onFocus={handleFocus} />);
      wrapper.find(TextInput).simulate('focus');
      expect(handleFocus).toHaveBeenCalled();
    });
  });

  describe('onChangeText', () => {
    test('is fired for when the TextInput content changes', () => {
      const handleChangeText = jest.fn();
      const wrapper = mount(<TextField label="tacos" onChangeText={handleChangeText} />);
      wrapper.find(TextInput).prop('onChangeText')('burritos');
      expect(handleChangeText).toHaveBeenCalledWith('burritos');
    });
  });
});
