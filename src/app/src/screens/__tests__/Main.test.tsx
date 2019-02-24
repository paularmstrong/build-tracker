import { act } from 'react-dom/test-utils';
import AppBar from '../../components/AppBar';
import ColorScalePicker from '../../components/ColorScalePicker';
import Drawer from '../../components/Drawer';
import Main from '../Main';
import React from 'react';
import { scales } from '../../context/ColorScale';
import { shallow } from 'enzyme';

jest.mock('../../components/Drawer', () => {
  const React = jest.requireActual('react');
  interface Props {
    children: React.ReactElement;
  }
  class Drawer extends React.Component<Props> {
    public render(): React.ReactElement {
      return <>{this.props.children}</>;
    }
    public show(): void {}
  }
  return Drawer;
});

describe('Main', () => {
  // TODO: refs don't seem to get populated
  test.skip('shows the drawer when AppBar pressNavigationIcon hit', () => {
    const showSpy = jest.spyOn(Drawer.prototype, 'show');
    const wrapper = shallow(<Main />);
    act(() => {
      wrapper.find(AppBar).simulate('pressNavigationIcon');
    });
    wrapper.update();
    expect(showSpy).toHaveBeenCalled();
  });

  test('sets color scale context when scale is selected', () => {
    const wrapper = shallow(<Main />);
    act(() => {
      wrapper.find(ColorScalePicker).prop('onSelect')(scales.Rainbow);
    });
    wrapper.update();
    expect(wrapper.childAt(0).prop('value')).toBe(scales.Rainbow);
  });
});
