import AppBar from '../AppBar';
import Button from '../Button';
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Text, View } from 'react-native';

describe('AppBar', () => {
  describe('rendering', () => {
    test('renders a basic bar with a title when given a string', () => {
      const wrapper = shallow(<AppBar title="Tacos" />);
      expect(
        wrapper
          .find(Text)
          .children()
          .text()
      ).toEqual('Tacos');
    });

    test('renders a title as provided when given an element', () => {
      const title = <View testID="foo" />;
      const wrapper = shallow(<AppBar title={title} />);
      expect(wrapper.find({ testID: 'foo' }).equals(title)).toBe(true);
    });

    test('renders a button when provided a navigationIcon', () => {
      const icon = View;
      const wrapper = shallow(<AppBar navigationIcon={icon} />);
      const button = wrapper.find(Button);
      expect(button.props()).toEqual(expect.objectContaining({ color: 'primary', icon, title: 'Menu' }));
    });

    test('renders action items', () => {
      const actionItems = [<View key="tacos" testID="tacos" />, <View key="burritos" testID="burritos" />];
      const wrapper = shallow(<AppBar actionItems={actionItems} />);
      expect(wrapper.find({ testID: 'tacos' }).exists()).toBe(true);
      expect(wrapper.find({ testID: 'burritos' }).exists()).toBe(true);
    });
  });

  describe('hide', () => {
    test('hides the app bar', () => {
      const wrapper = mount(<AppBar />);
      wrapper.instance().hide();
      expect(wrapper.html()).toMatch('top: -5rem;');
    });
  });

  describe('show', () => {
    test('shows the app bar', () => {
      const wrapper = mount(<AppBar />);
      wrapper.instance().show();
      expect(wrapper.html()).toMatch('top: 0px;');
    });
  });

  describe('setYScrollPosition', () => {
    test('when set less than the threshold, nothing happens', () => {
      const wrapper = mount(<AppBar />);
      wrapper.instance().setYScrollPosition(2);
      expect(wrapper.html()).toMatch('top: 0px;');
    });

    test('when set greater than the threshold, app bar is hidden', () => {
      const wrapper = mount(<AppBar />);
      wrapper.instance().setYScrollPosition(21);
      expect(wrapper.html()).toMatch('top: -5rem;');
    });

    test('when set less than the threshold (negative direction), app bar returns to visible', () => {
      const wrapper = mount(<AppBar />);
      wrapper.instance().hide();
      wrapper.instance().setYScrollPosition(-21);
      expect(wrapper.html()).toMatch('top: 0px;');
    });
  });
});
