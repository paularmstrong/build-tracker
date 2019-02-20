import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import Main from '../Main';
import { mount } from 'enzyme';
import React from 'react';

jest.mock('../../components/Drawer', () => {
  const React = jest.requireActual('react');
  class Drawer extends React.Component {
    public render(): React.ReactElement {
      return <div />;
    }
    public show(): void {}
  }
  return Drawer;
});

describe('Main', () => {
  test('shows the drawer when AppBar pressNavigationIcon hit', () => {
    const showSpy = jest.spyOn(Drawer.prototype, 'show');
    const wrapper = mount(<Main />);
    wrapper.find(AppBar).prop('onPressNavigationIcon')();
    expect(showSpy).toHaveBeenCalled();
  });
});
