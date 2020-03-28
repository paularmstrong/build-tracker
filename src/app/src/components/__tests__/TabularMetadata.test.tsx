/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import TabularMetadata from '../TabularMetadata';
import TextLink from '../TextLink';
import { View } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

describe('TabularMetadata', () => {
  describe('header', () => {
    test('renders a header with title and button', () => {
      const { getByText } = render(<TabularMetadata data={[]} title="Tacos" />);
      expect(getByText('Tacos')).not.toBeNull();
    });

    test('on button press, calls onClose method', () => {
      const handleClose = jest.fn();
      const { getByProps } = render(<TabularMetadata data={[]} onClose={handleClose} title="Tacos" />);
      fireEvent.press(getByProps({ role: 'button', 'aria-label': 'Close' }));
      expect(handleClose).toHaveBeenCalled();
    });

    test('does not require onClose method', () => {
      const { getByProps } = render(<TabularMetadata data={[]} title="Tacos" />);
      expect(() => fireEvent.press(getByProps({ role: 'button', 'aria-label': 'Close' }))).not.toThrow();
    });
  });

  describe('table', () => {
    test('renders rows with data', () => {
      const { getByText } = render(
        <TabularMetadata
          data={[
            ['special', 'tacos'],
            ['regular', 'burritos'],
          ]}
          title="Tacos"
        />
      );
      expect(getByText('special')).not.toBeNull();
      expect(getByText('tacos')).not.toBeNull();
      expect(getByText('regular')).not.toBeNull();
      expect(getByText('burritos')).not.toBeNull();
    });

    test('renders links when URLs are provided', () => {
      const { getByType } = render(
        <TabularMetadata data={[['special', { value: 'tacos', url: '/tacos-url' }]]} title="Tacos" />
      );
      expect(getByType(TextLink).props).toMatchObject({
        href: '/tacos-url',
        text: 'tacos',
      });
    });
  });

  describe('footer', () => {
    test('renders footer when provided', () => {
      const footer = <View testID="footer" />;
      const { getByTestId } = render(<TabularMetadata data={[]} footer={footer} title="Tacos" />);
      expect(getByTestId('footer')).not.toBeNull();
    });
  });
});
