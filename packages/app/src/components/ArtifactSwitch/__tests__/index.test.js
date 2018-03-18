// @flow
import * as React from 'react';
import Link from '../../Link';
import { shallow } from 'enzyme';
import { Switch } from 'react-native';
import WrappedArtifactSwitch from '../';

// $FlowFixMe
const ArtifactSwitch = WrappedArtifactSwitch.WrappedComponent;

describe('ArtifactSwitch', () => {
  let props: React.ElementConfig<typeof ArtifactSwitch>;
  beforeEach(() => {
    props = {
      active: true,
      artifactName: 'Tacos',
      color: '#F00',
      disabled: false,
      linked: false,
      match: { params: {} },
      onToggle: jest.fn()
    };
  });

  describe('Switch', () => {
    test('properties passed through', () => {
      const wrapper = shallow(<ArtifactSwitch {...props} />);
      const switchComponent = wrapper.find(Switch);
      expect(switchComponent.prop('value')).toBe(props.active);
      expect(switchComponent.prop('activeThumbColor')).toBe(props.color);
      expect(switchComponent.prop('disabled')).toBe(props.disabled);

      const wrapperDisabledInactive = shallow(<ArtifactSwitch {...props} active={false} disabled />);
      const disabledInactiveSwitchComponent = wrapperDisabledInactive.find(Switch);
      expect(disabledInactiveSwitchComponent.prop('value')).toBe(false);
      expect(disabledInactiveSwitchComponent.prop('disabled')).toBe(true);
    });

    test('triggers onToggle', () => {
      const wrapper = shallow(<ArtifactSwitch {...props} />);
      const switchComponent = wrapper.find(Switch);
      switchComponent.simulate('valueChange', true);
      expect(props.onToggle).toHaveBeenCalledWith('Tacos', true);
    });
  });

  describe('linked', () => {
    test('does not link if false', () => {
      const wrapper = shallow(<ArtifactSwitch {...props} />);
      expect(wrapper.find(Link)).toHaveLength(0);
    });

    test('will add a link', () => {
      const wrapper = shallow(<ArtifactSwitch {...props} linked />);
      const linkComponent = wrapper.find(Link);
      expect(linkComponent.prop('to')).toEqual('/Tacos');
    });

    test('URL when revisions present', () => {
      const match = {
        params: { revisions: '12345+67890' }
      };
      const wrapper = shallow(<ArtifactSwitch {...props} linked match={match} />);
      const linkComponent = wrapper.find(Link);
      expect(linkComponent.prop('to')).toEqual(`/revisions/${match.params.revisions}/Tacos`);
    });

    test('URL when compareRevisions present', () => {
      const match = {
        params: { compareRevisions: '12345,67890' }
      };
      const wrapper = shallow(<ArtifactSwitch {...props} linked match={match} />);
      const linkComponent = wrapper.find(Link);
      expect(linkComponent.prop('to')).toEqual(`/Tacos/${match.params.compareRevisions}`);
    });

    test('URL when revisions and compareRevisions present', () => {
      const match = {
        params: { revisions: '12345+67890', compareRevisions: '12345,67890' }
      };
      const wrapper = shallow(<ArtifactSwitch {...props} linked match={match} />);
      const linkComponent = wrapper.find(Link);
      expect(linkComponent.prop('to')).toEqual(
        `/revisions/${match.params.revisions}/Tacos/${match.params.compareRevisions}`
      );
    });
  });
});
