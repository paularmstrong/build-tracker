/**
 * Copyright (c) 2019 Paul Armstrong
 */
import DateTextField from '../DateTextField';
import formatDate from 'date-fns/format';
import React from 'react';
import startOfToday from 'date-fns/start_of_today';
import { fireEvent, render, waitForElement } from '@testing-library/react';

const thisMonth = formatDate(new Date(), 'MMMM');

describe('DateTextField', () => {
  describe('on press tab key', () => {
    test('hides the date picker', async () => {
      const { getByLabelText, queryAllByText } = render(<DateTextField label="foobar" onSet={jest.fn()} />);

      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      expect(queryAllByText(thisMonth)).toHaveLength(1);
      fireEvent.keyDown(getByLabelText('foobar'), { key: 'Tab' });
      fireEvent.keyUp(getByLabelText('foobar'), { key: 'Tab' });
      expect(queryAllByText(thisMonth)).toHaveLength(0);
    });
  });

  describe('onChangeText', () => {
    test('calls onSet for a valid date', async () => {
      const handleSet = jest.fn();
      const { getByLabelText, queryAllByText } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      fireEvent.change(getByLabelText('foobar'), { target: { value: '2019-03-26' } });
      expect(handleSet).toHaveBeenCalledWith(new Date('2019-03-26'));
      expect(getByLabelText('2019-03-26')).not.toBeUndefined();
    });

    test('does not call onSet for invalid date', async () => {
      const handleSet = jest.fn();
      const { getByLabelText, queryAllByText } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      fireEvent.change(getByLabelText('foobar'), { target: { value: '2019-0' } });
      expect(handleSet).not.toHaveBeenCalled();
      const today = formatDate(new Date(), 'YYYY-MM-DD');
      expect(getByLabelText(today)).not.toBeUndefined();
    });
  });

  describe('when selecting a date', () => {
    test('hides the date picker', async () => {
      const { getByLabelText, queryAllByText } = render(<DateTextField label="foobar" onSet={jest.fn()} />);
      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      expect(queryAllByText(thisMonth)).toHaveLength(1);

      const today = formatDate(new Date(), 'YYYY-MM-DD');
      fireEvent.touchStart(getByLabelText(today));
      fireEvent.touchEnd(getByLabelText(today));

      expect(queryAllByText(thisMonth)).toHaveLength(0);
    });

    test('calls onSet', async () => {
      const handleSet = jest.fn();
      const { getByLabelText, queryAllByText } = render(<DateTextField label="foobar" onSet={handleSet} />);
      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      expect(queryAllByText(thisMonth)).toHaveLength(1);

      const today = formatDate(startOfToday(), 'YYYY-MM-DD');
      fireEvent.touchStart(getByLabelText(today));
      fireEvent.touchEnd(getByLabelText(today));
      expect(handleSet).toHaveBeenCalledWith(startOfToday());
    });

    test('sets the text field value', async () => {
      const { getByLabelText, queryAllByText, getByDisplayValue } = render(<DateTextField label="foobar" />);
      fireEvent.focus(getByLabelText('foobar'));
      await waitForElement(() => queryAllByText(thisMonth));
      expect(queryAllByText(thisMonth)).toHaveLength(1);

      const today = formatDate(startOfToday(), 'YYYY-MM-DD');
      fireEvent.touchStart(getByLabelText(today));
      fireEvent.touchEnd(getByLabelText(today));
      expect(getByDisplayValue(today)).not.toBeUndefined();
    });
  });
});
