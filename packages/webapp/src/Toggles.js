// @flow
import theme from './theme';
import React, { PureComponent } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { ChartType, Types, TypesEnum, ValueType, XScaleType, YScaleType } from './values';

class ToggleGroup extends PureComponent {
  props: {
    color: string,
    currentValue: string,
    objectType: $Values<typeof Types>,
    onChange: Function
  };

  render() {
    const { color, currentValue, objectType } = this.props;

    return (
      <View style={styles.toggleGroup}>
        {Object.values(TypesEnum[objectType]).map(groupValue =>
          <Button
            color={color}
            disabled={currentValue === groupValue}
            key={groupValue}
            onPress={this._handlePress}
            size="small"
            style={styles.button}
            title={groupValue}
            value={groupValue}
          />
        )}
      </View>
    );
  }

  _handlePress = event => {
    const { objectType, onChange } = this.props;
    onChange(objectType, event.target.innerText);
  };
}

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

export default class Toggles extends PureComponent {
  props: {
    onToggle: Function,
    chartType: $Values<typeof ChartType>,
    valueType: $Values<typeof ValueType>,
    xScaleType: $Values<typeof XScaleType>,
    yScaleType: $Values<typeof YScaleType>
  };

  render() {
    const { onToggle } = this.props;
    return (
      <View style={styles.scaleTypeButtons}>
        {groups.map((group: Object, i) =>
          <ToggleGroup {...group} currentValue={group.getValue(this.props)} key={i} onChange={onToggle} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scaleTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  toggleGroup: {
    flexDirection: 'row',
    marginLeft: theme.spaceSmall
  },
  button: {
    fontSize: '12px'
  }
});
