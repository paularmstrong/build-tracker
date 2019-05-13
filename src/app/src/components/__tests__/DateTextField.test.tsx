/**
 * Copyright (c) 2019 Paul Armstrong
 */
import DatePicker from '../DatePicker';
import DateTextField from '../DateTextField';
import React from 'react';
import { TextInput } from 'react-native';
import { fireEvent, flushMicrotasksQueue, render } from 'react-native-testing-library';

describe('DateTextField', () => {
  describe('on press tab key', () => {
    test('hides the date picker', async () => {
      const { getByType, queryAllByType } = render(<DateTextField label="foobar" onSet={jest.fn()} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      expect(queryAllByType(DatePicker)).toHaveLength(1);
      fireEvent(getByType(TextInput), 'keyPress', { key: 'Tab' });
      expect(queryAllByType(DatePicker)).toHaveLength(0);
    });
  });

  describe('onChangeText', () => {
    test('calls onSet for a valid date', async () => {
      const handleSet = jest.fn();
      const { getByType } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      fireEvent(getByType(TextInput), 'changeText', '2019-03-26');
      expect(handleSet).toHaveBeenCalledWith(new Date('2019-03-26'));
      expect(getByType(DatePicker).props.selectedDate).toEqual(new Date('2019-03-26'));
    });

    test('does not call onSet for invalid date', async () => {
      const handleSet = jest.fn();
      const { getByType } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      fireEvent(getByType(TextInput), 'changeText', '2019-0');
      expect(handleSet).not.toHaveBeenCalled();
      expect(getByType(DatePicker).props.selectedDate).toBeUndefined();
    });
  });

  describe('when selecting a date', () => {
    test('hides the date picker', async () => {
      const { getByType, queryAllByType } = render(<DateTextField label="foobar" onSet={jest.fn()} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      expect(queryAllByType(DatePicker)).toHaveLength(1);

      fireEvent(getByType(DatePicker), 'select', new Date());
      expect(queryAllByType(DatePicker)).toHaveLength(0);
    });

    test('calls onSet', async () => {
      const handleSet = jest.fn();
      const { getByType, queryAllByType } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      expect(queryAllByType(DatePicker)).toHaveLength(1);

      const now = new Date();
      fireEvent(getByType(DatePicker), 'select', now);
      expect(handleSet).toHaveBeenCalledWith(now);
    });

    test('sets the text field value', async () => {
      const { getByType, queryAllByType } = render(<DateTextField label="foobar" onSet={jest.fn()} />);
      fireEvent(getByType(TextInput), 'focus');
      await flushMicrotasksQueue();
      expect(queryAllByType(DatePicker)).toHaveLength(1);

      fireEvent(getByType(DatePicker), 'select', new Date(2019, 2, 26));
      expect(getByType(TextInput).props.value).toBe('2019-03-26');
    });
  });
});
