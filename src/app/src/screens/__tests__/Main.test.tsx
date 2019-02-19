import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import Main from '../Main';
import React from 'react';
import { mount } from 'enzyme';
import { ScrollView } from 'react-native';

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

jest.mock('../../components/AppBar', () => {
  const React = jest.requireActual('react');
  class AppBar extends React.Component {
    public render(): React.ReactElement {
      return <div />;
    }
    public setYScrollPosition(): void {}
  }
  return AppBar;
});

describe('Main', () => {
  test('shows the drawer when AppBar pressNavigationIcon hit', () => {
    const showSpy = jest.spyOn(Drawer.prototype, 'show');
    const wrapper = mount(<Main />);
    wrapper.find(AppBar).prop('onPressNavigationIcon')();
    expect(showSpy).toHaveBeenCalled();
  });

  test('sets the app bar scroll position when main view is scrolled', () => {
    const scrollSpy = jest.spyOn(AppBar.prototype, 'setYScrollPosition');
    const wrapper = mount(<Main />);
    wrapper.find(ScrollView).simulate('scroll');
    jest.runAllTimers();
    expect(scrollSpy).toHaveBeenCalledWith(0);
  });
});
