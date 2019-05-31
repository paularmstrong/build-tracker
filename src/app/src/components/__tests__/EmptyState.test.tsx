/**
 * Copyright (c) 2019 Paul Armstrong
 */
import EmptyState from '../EmptyState';
import React from 'react';
import { render } from '@testing-library/react';

describe('EmptyState', () => {
  test('renders a message', () => {
    const { queryAllByText } = render(<EmptyState message="tacos rule" />);
    expect(queryAllByText('tacos rule')).toHaveLength(1);
  });
});
