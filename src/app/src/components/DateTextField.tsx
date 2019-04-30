/**
 * Copyright (c) 2019 Paul Armstrong
 */
import formatDate from 'date-fns/format';
import isValid from 'date-fns/is_valid';
import React from 'react';
import TextField from '../components/TextField';
import { StyleProp, View, ViewStyle } from 'react-native';

const DatePicker = React.lazy(() => import(/* webpackChunkName: "DatePicker" */ '../components/DatePicker'));

interface Props {
  initialValue?: Date;
  label: string;
  maxDate?: Date;
  minDate?: Date;
  onSet?: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
}

const format = 'YYYY-MM-DD';

const DateTextField = (props: Props): React.ReactElement => {
  const { initialValue, label, maxDate, minDate, onSet, style } = props;

  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [value, setValue] = React.useState<Date>(initialValue);
  const [stringValue, setStringValue] = React.useState<string>(
    initialValue && isValid(initialValue) ? formatDate(initialValue, format) : ''
  );
  const startDateRef = React.useRef<View>(null);

  const toggleDatePicker = React.useCallback(() => {
    setDatePickerVisible(visible => !visible);
  }, []);

  const handleSelect = React.useCallback(
    (date: Date) => {
      setValue(date);
      setStringValue(formatDate(date, format));
      onSet && onSet(date);
      setDatePickerVisible(false);
    },
    [onSet]
  );

  const handleChangeText = React.useCallback(
    (value: string) => {
      setStringValue(value);
      const date = new Date(value);
      if (isValid(date)) {
        setValue(date);
        onSet && onSet(date);
      }
    },
    [onSet]
  );

  const handleBlur = React.useCallback((): void => {
    setDatePickerVisible(false);
  }, []);

  return (
    <View ref={startDateRef} style={style}>
      <TextField
        label={label}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        onFocus={toggleDatePicker}
        value={stringValue}
      />
      {datePickerVisible ? (
        <React.Suspense fallback={null}>
          <DatePicker
            maxDate={maxDate}
            minDate={minDate}
            onDismiss={toggleDatePicker}
            onSelect={handleSelect}
            relativeTo={startDateRef}
            selectedDate={value}
          />
        </React.Suspense>
      ) : null}
    </View>
  );
};

export default DateTextField;
