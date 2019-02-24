import * as Theme from '../../theme';
import ColorScale from './ColorScale';
import React from 'react';
import { scales } from '../../context/ColorScale';
import { ScaleSequential } from 'd3-scale';
import { StyleSheet, View } from 'react-native';

interface Props {
  onSelect: (scale: ScaleSequential<string>) => void;
}

export const ColorScalePicker = (props: Props): React.ReactElement => {
  const { onSelect } = props;
  return (
    <View style={styles.root}>
      {Object.entries(scales).map(([name, scale]) => {
        return <ColorScale boxes={40} key={name} name={name} onSelect={onSelect} scale={scale} style={styles.scale} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    marginHorizontal: Theme.Spacing.Normal
  },
  scale: {
    marginBottom: Theme.Spacing.Small
  }
});

export default React.memo(ColorScalePicker);
