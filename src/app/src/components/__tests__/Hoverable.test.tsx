import Hoverable from '../Hoverable';
import React from 'react';
import { mount } from 'enzyme';

describe('Hoverable', () => {
  describe('when hover is supported', () => {
    beforeEach(() => {
      // Enable the hover monitor
      document.dispatchEvent(new Event('mousemove'));
    });

    describe('render props', () => {
      test('returns true when component is hovered', () => {
        const hoverFn = jest.fn(() => <div />);
        const TestHover = (): React.ReactElement => <Hoverable>{hoverFn}</Hoverable>;
        const wrapper = mount(<TestHover />);
        wrapper.simulate('mouseEnter');
        expect(hoverFn).toHaveBeenCalledWith(true);
      });

      test('returns false when component is not hovered', () => {
        const hoverFn = jest.fn(() => <div />);
        const TestHover = (): React.ReactElement => <Hoverable>{hoverFn}</Hoverable>;
        const wrapper = mount(<TestHover />);
        wrapper.simulate('mouseEnter');
        wrapper.simulate('mouseLeave');
        expect(hoverFn).toHaveBeenNthCalledWith(1, false);
        expect(hoverFn).toHaveBeenNthCalledWith(2, true);
        expect(hoverFn).toHaveBeenNthCalledWith(3, false);
      });
    });

    describe('handler props', () => {
      test('calls onHoverIn', () => {
        const hoverFn = jest.fn();
        const TestHover = (): React.ReactElement => (
          <Hoverable onHoverIn={hoverFn}>
            <div />
          </Hoverable>
        );
        const wrapper = mount(<TestHover />);
        wrapper.simulate('mouseEnter');
        expect(hoverFn).toHaveBeenCalled();
      });

      test('calls onHoverOut', () => {
        const hoverFn = jest.fn();
        const TestHover = (): React.ReactElement => (
          <Hoverable onHoverOut={hoverFn}>
            <div />
          </Hoverable>
        );
        const wrapper = mount(<TestHover />);
        wrapper.simulate('mouseEnter');
        wrapper.simulate('mouseLeave');
        expect(hoverFn).toHaveBeenCalled();
      });
    });
  });

  describe('when hover is not supported', () => {
    beforeEach(() => {
      // Disable the hover monitor
      document.dispatchEvent(new Event('touchstart'));
    });

    test('does not send hover even if mouseEnter is triggered', () => {
      const hoverFn = jest.fn(() => <div />);
      const TestHover = (): React.ReactElement => <Hoverable>{hoverFn}</Hoverable>;
      const wrapper = mount(<TestHover />);
      wrapper.simulate('mouseEnter');
      expect(hoverFn).not.toHaveBeenCalledWith(true);
    });

    test('does not send hover even if mouseLeave is triggered', () => {
      const hoverFn = jest.fn(() => <div />);
      const TestHover = (): React.ReactElement => <Hoverable>{hoverFn}</Hoverable>;
      const wrapper = mount(<TestHover />);
      wrapper.simulate('mouseEnter');
      wrapper.simulate('mouseLeave');
      expect(hoverFn).not.toHaveBeenCalledWith(true);
    });
  });
});
