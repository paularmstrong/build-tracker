/**
 * Copyright (c) 2019 Paul Armstrong
 */
import React from 'react';
import { render } from 'react-testing-library';
import Snackbar from '../Snackbar';

describe('Snackbar', () => {
  test('renders to a portal', () => {
    const portal = document.createElement('div');
    portal.setAttribute('id', 'snackbarPortal');
    document.body.appendChild(portal);

    const { queryAllByRole, queryAllByText } = render(<Snackbar text="foobar" />, {
      container: portal
    });

    expect(queryAllByRole('alert')).toHaveLength(1);
    expect(queryAllByText('foobar')).toHaveLength(1);
  });

  test('renders directly without a portal available', () => {
    const { queryAllByRole, queryAllByText } = render(<Snackbar text="foobar" />);

    expect(queryAllByRole('alert')).toHaveLength(1);
    expect(queryAllByText('foobar')).toHaveLength(1);
  });
});
