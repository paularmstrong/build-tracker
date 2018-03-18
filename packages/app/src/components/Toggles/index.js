// @flow
import * as React from 'react';
import theme from '../../theme';
import ToggleGroup from './Group';
import { ChartType, Types, ValueType, XScaleType, YScaleType } from '../../modules/values';
import { StyleSheet, View } from 'react-native';

type Props = {|
  onToggle: $PropertyType<React.ElementConfig<typeof ToggleGroup>, 'onChange'>,
  chartType: $Values<typeof ChartType>,
  valueType: $Values<typeof ValueType>,
  xScaleType: $Values<typeof XScaleType>,
  yScaleType: $Values<typeof YScaleType>
|};

const groups = [
  {
    objectType: Types.CHART,
    color: theme.colorBlue,
    getValue: props => props.chartType
  },
  {
    objectType: Types.VALUES,
    color: theme.colorSalmon,
    getValue: props => props.valueType
  },
  {
    objectType: Types.YSCALE,
    color: theme.colorOrange,
    getValue: props => props.yScaleType
  },
  {
    objectType: Types.XSCALE,
    color: theme.colorGreen,
    getValue: props => props.xScaleType
  }
];

export default class Toggles extends React.PureComponent<Props> {
  render() {
    const { onToggle } = this.props;
    return (
      <View style={styles.scaleTypeButtons}>
        {groups.map((group: Object, i) => (
          <ToggleGroup {...group} currentValue={group.getValue(this.props)} key={i} onChange={onToggle} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scaleTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
