import Button from '../Button';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  isSelected?: boolean;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  value: string;
}

const SizeKeyPicker = (props: Props): React.ReactElement => {
  const { isSelected, onSelect, style, value } = props;

  const handleSelect = React.useCallback(() => {
    onSelect(value);
  }, [onSelect, value]);

  return (
    <Button
      aria-selected={isSelected}
      color={isSelected ? 'primary' : 'secondary'}
      disabled={isSelected}
      onPress={handleSelect}
      style={style}
      title={value}
      type="unelevated"
    />
  );
};

export default SizeKeyPicker;
