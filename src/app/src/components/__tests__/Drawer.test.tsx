/**
 * Copyright (c) 2019 Paul Armstrong
 */
import Drawer from '../Drawer';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

describe('Drawer', () => {
  describe('hidden', () => {
    test('is hidden initially', () => {
      const { getByRole } = render(
        <Drawer hidden>
          <div />
        </Drawer>
      );
      expect(getByRole('nav').getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('show', () => {
    test('makes the drawer visible', () => {
      const ref = React.createRef<Drawer>();
      const { getByRole } = render(
        // @ts-ignore
        <Drawer hidden ref={ref}>
          <div />
        </Drawer>
      );
      ref.current.show();
      expect(getByRole('nav').getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('scrim', () => {
    test('hides the drawer when pressed', () => {
      const ref = React.createRef<Drawer>();
      const { getByLabelText, getByRole } = render(
        // @ts-ignore
        <Drawer hidden ref={ref}>
          <div />
        </Drawer>
      );
      ref.current.show();

      fireEvent.touchStart(getByLabelText('Dismiss navigation'));
      fireEvent.touchEnd(getByLabelText('Dismiss navigation'));
      expect(getByRole('nav').getAttribute('aria-hidden')).toBe('true');
    });
  });
});
