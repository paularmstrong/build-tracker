/**
 * Copyright (c) 2019 Paul Armstrong
 */
import DatePicker from '../DatePicker';
import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('DatePicker', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  describe('minDate', () => {
    test('disables days before the minDate', () => {
      const { queryAllByProps } = render(
        <DatePicker minDate={new Date(2019, 2, 26)} relativeTo={viewRef} selectedDate={new Date(2019, 2, 27)} />
      );
      expect(queryAllByProps({ accessibilityLabel: '2019-03-25', disabled: true, type: 'text' })).toHaveLength(1);
    });
  });

  describe('maxDate', () => {
    test('disables days after the maxDate', () => {
      const { queryAllByProps } = render(
        <DatePicker maxDate={new Date(2019, 2, 26)} relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      expect(queryAllByProps({ accessibilityLabel: '2019-03-27', disabled: true, type: 'text' })).toHaveLength(1);
    });
  });

  describe('selectedDate', () => {
    test('sets a different style for the selected date', () => {
      const { queryAllByProps } = render(<DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />);
      expect(queryAllByProps({ accessibilityLabel: '2019-03-23', disabled: false, type: 'unelevated' })).toHaveLength(
        1
      );
    });
  });

  describe('navigation', () => {
    test('next month moves forward', () => {
      const { getByProps, queryAllByText } = render(
        <DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      expect(queryAllByText('March')).toHaveLength(1);
      fireEvent.press(getByProps({ title: 'Next month' }));
      expect(queryAllByText('April')).toHaveLength(1);
    });

    test('previous month moves forward', () => {
      const { getByProps, queryAllByText } = render(
        <DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      expect(queryAllByText('March')).toHaveLength(1);
      fireEvent.press(getByProps({ title: 'Previous month' }));
      expect(queryAllByText('February')).toHaveLength(1);
    });
  });

  describe('onSelect', () => {
    test('fires when day button is pressed', () => {
      const handleSelect = jest.fn();
      const { getByProps } = render(
        <DatePicker onSelect={handleSelect} relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      fireEvent.press(getByProps({ accessibilityLabel: '2019-03-24', disabled: false }));
      expect(handleSelect).toHaveBeenCalledWith(new Date(2019, 2, 24));
    });
  });
});
