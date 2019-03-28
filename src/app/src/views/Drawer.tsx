/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import ColorScalePicker from '../components/ColorScalePicker';
import Divider from '../components/Divider';
import Drawer from '../components/Drawer';
import DrawerLink from '../components/DrawerLink';
import HeartIcon from '../icons/Heart';
import OpenInExternalIcon from '../icons/OpenInExternal';
import React from 'react';
import { setDisabledArtifactsVisible } from '../store/actions';
import SizeKeyPicker from '../components/SizeKeyPicker';
import { State } from '../store/types';
import Subtitle from '../components/Subtitle';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useDispatch, useMappedState } from 'redux-react-hook';

interface MappedState {
  comparator: State['comparator'];
  disabledArtifactsVisible: State['disabledArtifactsVisible'];
}

const mapState = (state: State): MappedState => ({
  comparator: state.comparator,
  disabledArtifactsVisible: state.disabledArtifactsVisible
});

const DrawerView = (_props: {}, ref: React.RefObject<Drawer>): React.ReactElement => {
  const { comparator, disabledArtifactsVisible } = useMappedState(mapState);
  const dispatch = useDispatch();

  const handleToggleDisabled = React.useCallback(
    (showDisabled: boolean): void => {
      dispatch(setDisabledArtifactsVisible(showDisabled));
    },
    [dispatch]
  );

  return (
    <Drawer hidden ref={ref}>
      <View style={styles.header}>
        <Text style={styles.title}>Build Tracker</Text>
      </View>
      <Divider />
      <Subtitle title="Compare artifacts by" />
      <SizeKeyPicker keys={comparator.sizeKeys} />
      <Divider />
      <View style={styles.switchRoot}>
        {
          // @ts-ignore
          <Switch
            activeThumbColor={Theme.Color.Primary30}
            activeTrackColor={Theme.Color.Primary00}
            onValueChange={handleToggleDisabled}
            style={styles.switch}
            value={disabledArtifactsVisible}
          />
        }
        <Text>Show disabled artifacts</Text>
      </View>
      <Divider />
      <Subtitle title="Color scale" />
      <ColorScalePicker />
      <Divider />
      <View style={styles.footer}>
        <Subtitle title="Links" />
        <DrawerLink href="https://github.com/paularmstrong/build-tracker" icon={OpenInExternalIcon} text="Github" />
      </View>
      <View style={styles.attribution}>
        <Text style={styles.attrText}>
          Created with <HeartIcon accessibilityLabel="love" style={styles.heart} /> by{' '}
          {
            // @ts-ignore
            <Text accessibilityRole="link" href="https://twitter.com/paularmstrong" target="_blank">
              Paul Armstrong
            </Text>
          }
        </Text>
      </View>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: Theme.Spacing.Large
  },
  // @ts-ignore
  title: {
    color: Theme.Color.Primary40,
    fontWeight: Theme.FontWeight.Bold,
    fontSize: Theme.FontSize.Large
  },
  switchRoot: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.Normal
  },
  switch: {
    marginEnd: Theme.Spacing.Small
  },
  attribution: {
    paddingVertical: Theme.Spacing.Large,
    flexDirection: 'row'
  },
  attrText: {
    width: '100%'
  },
  heart: {
    color: Theme.Color.Secondary30
  }
});

export default React.forwardRef(DrawerView);
