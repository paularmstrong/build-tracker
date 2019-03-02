/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import ColorScalePicker from '../components/ColorScalePicker';
import Comparator from '@build-tracker/comparator';
import Divider from '../components/Divider';
import Drawer from '../components/Drawer';
import DrawerLink from '../components/DrawerLink';
import HeartIcon from '../icons/Heart';
import React from 'react';
import { ScaleSequential } from 'd3-scale';
import SizeKeyPicker from '../components/SizeKeyPicker';
import Subtitle from '../components/Subtitle';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface Props {
  colorScale: ScaleSequential<string>;
  comparator: Comparator;
  disabledArtifactsVisible: boolean;
  onSelectColorScale: (scale: ScaleSequential<string>) => void;
  onSelectSizeKey: (sizeKey: string) => void;
  onToggleDisabledArtifacts: (showDisabled: boolean) => void;
  sizeKey: string;
}

const DrawerView = (props: Props, ref: React.RefObject<Drawer>): React.ReactElement => {
  const {
    colorScale,
    comparator,
    disabledArtifactsVisible,
    onSelectColorScale,
    onSelectSizeKey,
    onToggleDisabledArtifacts,
    sizeKey
  } = props;
  return (
    <Drawer hidden ref={ref}>
      <View style={styles.header}>
        <Text style={styles.title}>Build Tracker</Text>
      </View>
      <Divider />
      <Subtitle title="Compare artifacts by" />
      <SizeKeyPicker keys={comparator.sizeKeys} onSelect={onSelectSizeKey} selected={sizeKey} />
      <Divider />
      <View style={styles.switchRoot}>
        {
          // @ts-ignore
          <Switch
            activeThumbColor={Theme.Color.Primary30}
            activeTrackColor={Theme.Color.Primary00}
            onValueChange={onToggleDisabledArtifacts}
            style={styles.switch}
            value={disabledArtifactsVisible}
          />
        }
        <Text>Show disabled artifacts</Text>
      </View>
      <Divider />
      <Subtitle title="Color scale" />
      <ColorScalePicker activeColorScale={colorScale} onSelect={onSelectColorScale} />
      <Divider />
      <View style={styles.footer}>
        <Subtitle title="Links" />
        <DrawerLink href="https://github.com/paularmstrong/build-tracker" text="Github" />
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
