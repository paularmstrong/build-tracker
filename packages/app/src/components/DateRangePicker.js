// @flow
import * as React from 'react';
import endOfDay from 'date-fns/end_of_day';
import ModalDatePicker from './DatePicker/Modal';
import startOfDay from 'date-fns/start_of_day';
import theme from '../theme';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  endDate: Date,
  onChangeRange: (startDate: Date, endDate: Date) => void,
  startDate: Date
};
type State = {
  endDate?: Date,
  showEndDatePicker: boolean,
  showStartDatePicker: boolean,
  startDate?: Date
};

const today = new Date();

export default class DateRangePicker extends React.Component<Props, State> {
  _endInputRef: React.ElementRef<typeof TextInput>;
  _startInputRef: React.ElementRef<typeof TextInput>;

  state = {
    showEndDatePicker: false,
    showStartDatePicker: false
  };

  render() {
    const { endDate, startDate } = this.props;
    const { showEndDatePicker, showStartDatePicker } = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.date}>
          <Text>Start Date</Text>
          <TextInput
            onFocus={this._handleToggleStartDatePicker}
            ref={this._handleStartInputRef}
            style={styles.input}
            value={startDate.toLocaleDateString()}
          />
        </View>
        <View style={styles.date}>
          <Text>End Date</Text>
          <TextInput
            onFocus={this._handleToggleEndDatePicker}
            ref={this._handleEndInputRef}
            style={styles.input}
            value={endDate.toLocaleDateString()}
          />
        </View>
        {showEndDatePicker ? (
          <ModalDatePicker
            maxDate={today}
            minDate={startDate}
            onSelectDate={this._handleSelectEndDate}
            relativeTo={this._endInputRef}
            selectedDate={endDate}
          />
        ) : null}
        {showStartDatePicker ? (
          <ModalDatePicker
            maxDate={endDate}
            onSelectDate={this._handleSelectStartDate}
            relativeTo={this._startInputRef}
            selectedDate={startDate}
          />
        ) : null}
      </View>
    );
  }

  _handleSelectEndDate = (endDate: Date) => {
    this.setState({ endDate: endOfDay(endDate) }, this._afterSelectDate);
    this._handleToggleEndDatePicker();
  };

  _handleSelectStartDate = (startDate: Date) => {
    this.setState({ startDate: startOfDay(startDate) }, this._afterSelectDate);
    this._handleToggleStartDatePicker();
  };

  _afterSelectDate = () => {
    this.props.onChangeRange(this.state.startDate || this.props.startDate, this.state.endDate || this.props.endDate);
  };

  _handleToggleEndDatePicker = () => {
    this.setState(({ showEndDatePicker, showStartDatePicker }) => {
      const newEndPickerStatus = !showEndDatePicker;
      const newStartPickerStatus = newEndPickerStatus ? false : showStartDatePicker;
      return { showEndDatePicker: newEndPickerStatus, showStartDatePicker: newStartPickerStatus };
    });
  };

  _handleToggleStartDatePicker = () => {
    this.setState(({ showEndDatePicker, showStartDatePicker }) => {
      const newStartPickerStatus = !showStartDatePicker;
      const newEndPickerStatus = newStartPickerStatus ? false : showEndDatePicker;
      return { showEndDatePicker: newEndPickerStatus, showStartDatePicker: newStartPickerStatus };
    });
  };

  _handleStartInputRef = (ref: ?React.ElementRef<typeof TextInput>) => {
    if (ref) {
      this._startInputRef = ref;
    }
  };

  _handleEndInputRef = (ref: ?React.ElementRef<typeof TextInput>) => {
    if (ref) {
      this._endInputRef = ref;
    }
  };
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row'
  },
  date: {
    flexGrow: 1,
    marginHorizontal: theme.spaceMedium
  },
  input: {
    borderRadius: 3,
    borderColor: theme.colorGray,
    borderWidth: '2px'
  }
});
