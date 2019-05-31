/**
 * Copyright (c) 2019 Paul Armstrong
 */
import DatePicker from '../DatePicker';
import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react';

describe('DatePicker', () => {
  let viewRef;
  beforeEach(() => {
    viewRef = React.createRef();
    render(<View ref={viewRef} />);
  });

  describe('minDate', () => {
    test('disables days before the minDate', () => {
      const handleSelect = jest.fn();
      const { getByLabelText } = render(
        <DatePicker
          minDate={new Date(2019, 2, 26)}
          onSelect={handleSelect}
          relativeTo={viewRef}
          selectedDate={new Date(2019, 2, 27)}
        />
      );
      const beforeDay = getByLabelText('2019-03-25');
      fireEvent.touchStart(beforeDay);
      fireEvent.touchEnd(beforeDay);
      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe('maxDate', () => {
    test('disables days after the maxDate', () => {
      const handleSelect = jest.fn();
      const { getByLabelText } = render(
        <DatePicker
          maxDate={new Date(2019, 2, 26)}
          onSelect={handleSelect}
          relativeTo={viewRef}
          selectedDate={new Date(2019, 2, 23)}
        />
      );
      const afterDay = getByLabelText('2019-03-27');
      fireEvent.touchStart(afterDay);
      fireEvent.touchEnd(afterDay);
      expect(handleSelect).not.toHaveBeenCalled();
    });
  });

  describe('selectedDate', () => {
    test('sets a different style for the selected date', () => {
      const { getByLabelText } = render(<DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />);
      const today = getByLabelText('2019-03-23');
      const yesterday = getByLabelText('2019-03-22');
      // @ts-ignore
      expect(yesterday.style).not.toEqual(today.style);
    });
  });

  describe('navigation', () => {
    test('next month moves forward', () => {
      const { getByLabelText, queryAllByText } = render(
        <DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      expect(queryAllByText('March')).toHaveLength(1);
      fireEvent.touchStart(getByLabelText('Next month'));
      fireEvent.touchEnd(getByLabelText('Next month'));
      expect(queryAllByText('April')).toHaveLength(1);
    });

    test('previous month moves forward', () => {
      const { getByLabelText, queryAllByText } = render(
        <DatePicker relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      expect(queryAllByText('March')).toHaveLength(1);
      fireEvent.touchStart(getByLabelText('Previous month'));
      fireEvent.touchEnd(getByLabelText('Previous month'));
      expect(queryAllByText('February')).toHaveLength(1);
    });
  });

  describe('onSelect', () => {
    test('fires when day button is pressed', () => {
      const handleSelect = jest.fn();
      const { getByLabelText } = render(
        <DatePicker onSelect={handleSelect} relativeTo={viewRef} selectedDate={new Date(2019, 2, 23)} />
      );
      fireEvent.touchStart(getByLabelText('2019-03-24'));
      fireEvent.touchEnd(getByLabelText('2019-03-24'));
      expect(handleSelect).toHaveBeenCalledWith(new Date(2019, 2, 24));
    });
  });
});
