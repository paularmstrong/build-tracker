// @flow
import * as React from 'react';
import theme from '../../theme';
import { Button, StyleSheet, View } from 'react-native';
import { Types, TypesEnum } from '../../modules/values';

type OnToggleChange = ($Values<typeof Types>, text: string) => void;

type Props = {|
  color: string,
  currentValue: string,
  objectType: $Values<typeof Types>,
  onChange: OnToggleChange
|};

export default class ToggleGroup extends React.PureComponent<Props> {
  render() {
    const { color, currentValue, objectType } = this.props;

    return (
      <View style={styles.toggleGroup}>
        {Object.values(TypesEnum[objectType]).map(groupValue => {
          if (typeof groupValue !== 'string') {
            return null;
          }
          return (
            <Button
              color={color}
              disabled={currentValue === groupValue.toLowerCase()}
              key={groupValue}
              onPress={this._handlePress}
              size="small"
              style={styles.button}
              title={groupValue}
              value={groupValue}
            />
          );
        })}
      </View>
    );
  }

  _handlePress = (event: SyntheticEvent<HTMLDivElement>) => {
    const { objectType, onChange } = this.props;
    // $FlowFixMe
    onChange(objectType, event.currentTarget.innerText.trim().toLowerCase());
  };
}

const styles = StyleSheet.create({
  toggleGroup: {
    flexDirection: 'row',
    marginLeft: theme.spaceSmall
  },
  button: {
    fontSize: '12px'
  }
});
