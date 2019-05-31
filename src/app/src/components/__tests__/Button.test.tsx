/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Button from '../Button';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

describe('Button', () => {
  describe('icon', () => {
    test('renders an icon before the title', () => {
      const FakeIcon = (): React.ReactElement => <div data-testid="icon" />;
      const { getByTestId, queryAllByText } = render(<Button icon={FakeIcon} title="tacos" />);
      expect(getByTestId('icon')).not.toBeUndefined();
      expect(queryAllByText('tacos')).toHaveLength(1);
    });

    test('does not render the title when iconOnly', () => {
      const FakeIcon = (): React.ReactElement => <div />;
      const { getByText } = render(<Button icon={FakeIcon} iconOnly title="tacos" />);
      expect(() => getByText('tacos')).toThrow();
    });
  });

  describe('onPress', () => {
    test('property is called when button is pressed', () => {
      const handlePress = jest.fn();
      const { getByRole } = render(<Button onPress={handlePress} title="tacos" />);
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(handlePress).toHaveBeenCalled();
    });

    test('property is not called when disabled', () => {
      const handlePress = jest.fn();
      const { getByRole } = render(<Button disabled onPress={handlePress} title="tacos" />);
      fireEvent.touchStart(getByRole('button'));
      fireEvent.touchEnd(getByRole('button'));
      expect(handlePress).not.toHaveBeenCalled();
    });
  });

  describe('styles', () => {
    describe('active', () => {
      test('sets active styles while press inside', () => {
        const { getByRole } = render(<Button title="tacos" type="raised" />);
        fireEvent.touchStart(getByRole('button'), { locationX: 0, locationY: 0 });
        // @ts-ignore
        expect(getByRole('button').firstChild.style.boxShadow).toEqual('0px 2px 3px rgba(0,0,0,0.30)');
        fireEvent.touchEnd(getByRole('button'), { locationX: 0, locationY: 0 });
      });

      test('removes active styles after press out', () => {
        const { getByRole } = render(<Button title="tacos" type="raised" />);
        fireEvent.touchStart(getByRole('button'), { locationX: 0, locationY: 0 });
        fireEvent.touchEnd(getByRole('button'), { locationX: 0, locationY: 0 });
        // @ts-ignore
        expect(getByRole('button').firstChild.style.boxShadow).toEqual('0px 2px 5px rgba(0,0,0,0.30)');
      });

      test('when disabled, does not set active styles', () => {
        const { getByRole } = render(<Button disabled title="tacos" type="raised" />);
        fireEvent.touchStart(getByRole('button'), { locationX: 0, locationY: 0 });
        // @ts-ignore
        expect(getByRole('button').firstChild.style.boxShadow).toEqual('0px 2px 5px rgba(0,0,0,0.30)');
        fireEvent.touchEnd(getByRole('button'), { locationX: 0, locationY: 0 });
        // @ts-ignore
        expect(getByRole('button').firstChild.style.boxShadow).toEqual('0px 2px 5px rgba(0,0,0,0.30)');
      });
    });
  });
});
