import Button from '../Button';
import React from 'react';
import { shallow } from 'enzyme';

describe('Button', () => {
  describe('icon', () => {
    test('renders an icon before the title', () => {
      const FakeIcon = (): React.ReactElement => <div />;
      const wrapper = shallow(<Button icon={FakeIcon} title="tacos" />);
      expect(
        wrapper
          .shallow()
          .find(FakeIcon)
          .exists()
      ).toBe(true);
    });

    test('does not render the title when iconOnly', () => {
      const FakeIcon = (): React.ReactElement => <div />;
      const wrapper = shallow(<Button icon={FakeIcon} iconOnly title="tacos" />);
      expect(
        wrapper
          .shallow()
          .find(FakeIcon)
          .parent()
          .html()
      ).not.toMatch('tacos');
    });
  });

  describe('onPress', () => {
    test('property is called when button is pressed', () => {
      const onPress = jest.fn();
      const wrapper = shallow(<Button onPress={onPress} title="tacos" />).shallow();
      wrapper.simulate('press');
      expect(onPress).toHaveBeenCalled();
    });

    test('property is not called when disabled', () => {
      const onPress = jest.fn();
      const wrapper = shallow(<Button disabled onPress={onPress} title="tacos" />).shallow();
      wrapper.simulate('press');
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('styles', () => {
    describe('active', () => {
      test('sets active styles while press inside', () => {
        const wrapper = shallow(<Button title="tacos" type="raised" />);
        wrapper.shallow().simulate('pressIn');
        expect(wrapper.html()).toMatch('box-shadow:0px 2px 3px rgba(0,0,0,0.30);');
      });

      test('removes active styles after press out', () => {
        const wrapper = shallow(<Button title="tacos" type="raised" />);
        wrapper.shallow().simulate('pressIn');
        wrapper.update();
        wrapper.shallow().simulate('pressOut');
        expect(wrapper.html()).toMatch('box-shadow:0px 2px 5px rgba(0,0,0,0.30);');
      });

      test('when disabled, does not set active styles', () => {
        const wrapper = shallow(<Button disabled title="tacos" type="raised" />);
        wrapper.shallow().simulate('pressIn');
        expect(wrapper.html()).toMatch('box-shadow:0px 2px 5px rgba(0,0,0,0.30);');
        wrapper.shallow().simulate('pressOut');
        expect(wrapper.html()).toMatch('box-shadow:0px 2px 5px rgba(0,0,0,0.30);');
      });
    });
  });
});
