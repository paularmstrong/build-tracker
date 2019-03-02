/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import ColorScalePicker from '../components/ColorScalePicker';
import Comparator from '@build-tracker/comparator';
import Divider from '../components/Divider';
import Drawer from '../components/Drawer';
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
    </Drawer>
  );
};

const styles = StyleSheet.create({
  switchRoot: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.Normal
  },
  switch: {
    marginEnd: Theme.Spacing.Small
  }
});

export default React.forwardRef(DrawerView);
