/**
 * Copyright (c) 2019 Paul Armstrong
 */
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
  onSelectColorScale: (scale: ScaleSequential<string>) => void;
  onSelectSizeKey: (sizeKey: string) => void;
  sizeKey: string;
}

const DrawerView = (props: Props, ref: React.RefObject<Drawer>): React.ReactElement => {
  const { colorScale, comparator, onSelectColorScale, onSelectSizeKey, sizeKey } = props;
  return (
    <Drawer hidden ref={ref}>
      <Subtitle title="Compare artifacts by" />
      <SizeKeyPicker keys={comparator.sizeKeys} onSelect={onSelectSizeKey} selected={sizeKey} />
      <Divider />
      <View style={styles.switchRoot}>
        <Text>Hide disabled artifacts</Text>
        <Switch />
      </View>
      <Divider />
      <Subtitle title="Color scale" />
      <ColorScalePicker activeColorScale={colorScale} onSelect={onSelectColorScale} />
    </Drawer>
  );
};

const styles = StyleSheet.create({
  switchRoot: {
    flexDirection: 'row'
  }
});

export default React.forwardRef(DrawerView);
