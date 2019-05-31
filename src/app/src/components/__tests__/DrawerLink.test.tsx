/**
 * Copyright (c) 2019 Paul Armstrong
 */
import DrawerLink from '../DrawerLink';
import HeartIcon from '../../icons/Heart';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

describe('DrawerLink', () => {
  describe('icon', () => {
    test('does not render an icon', () => {
      const { getByRole } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      expect(getByRole('link').firstChild).toMatchInlineSnapshot(`
        <div
          class="css-text-76zvg2"
          dir="auto"
          style="font-size: 1rem;"
        >
          tacos
        </div>
      `);
    });

    test('renders the icon', () => {
      const { getByRole } = render(<DrawerLink href="https://build-tracker.local" icon={HeartIcon} text="tacos" />);
      // @ts-ignore
      expect(getByRole('link').firstChild.firstChild.tagName).toEqual('svg');
    });
  });

  describe('hover', () => {
    beforeEach(() => {
      document.dispatchEvent(new Event('mousemove'));
    });

    test('adds a bg color', () => {
      const { getByRole } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      const link = getByRole('link');
      expect(link.style.backgroundColor).toEqual('');
      fireEvent.mouseEnter(link);
      expect(link.style.backgroundColor).toEqual('rgb(199, 235, 255)');
    });

    test('changes font color', () => {
      const { getByRole } = render(<DrawerLink href="https://build-tracker.local" text="tacos" />);
      const link = getByRole('link');
      // @ts-ignore
      expect(link.firstChild.style.color).toEqual('');
      fireEvent.mouseEnter(link);
      // @ts-ignore
      expect(link.firstChild.style.color).toEqual('rgb(18, 52, 108)');
    });
  });
});
