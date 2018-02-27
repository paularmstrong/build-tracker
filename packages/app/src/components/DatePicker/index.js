// @flow
import * as React from 'react';
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import formatDate from 'date-fns/format';
import getDaysInMonth from 'date-fns/get_days_in_month';
import Hoverable from '../Hoverable';
import isEqual from 'date-fns/is_equal';
import isSameMonth from 'date-fns/is_same_month';
import startOfDay from 'date-fns/start_of_day';
import startOfMonth from 'date-fns/start_of_month';
import startOfToday from 'date-fns/start_of_today';
import startOfWeek from 'date-fns/start_of_week';
import subMonths from 'date-fns/sub_months';
import theme from '../../theme';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  maxDate: Date,
  minDate: Date,
  startDate: Date,
  onSelectDate?: (date: Date) => void,
  selectedDate?: Date,
  style?: mixed
};

type State = {
  currentMonth: Date,
  selectedDate?: Date
};

type DayInfo = {
  date: Date,
  isSameMonth: boolean
};

const noop = () => {};

export default class DatePicker extends React.Component<Props, State> {
  static defaultProps = {
    maxDate: new Date(8640000000000000),
    minDate: new Date(-8640000000000000),
    startDate: startOfToday()
  };

  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      currentMonth: startOfMonth(props.startDate),
      selectedDate: props.selectedDate && startOfDay(props.selectedDate)
    };
  }

  render() {
    const { maxDate, minDate, onSelectDate, style } = this.props;
    const { currentMonth, selectedDate } = this.state;
    const daysInMonth = getDaysInMonth(currentMonth);
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });

    const month = new Array(Math.ceil(daysInMonth / 7 + 2)).fill().reduce((memo, week, weekIndex) => {
      const firstDayOfWeek = addDays(startDate, weekIndex * 7);
      if (weekIndex > 0 && !isSameMonth(firstDayOfWeek, currentMonth)) {
        return memo;
      }
      memo.push(
        new Array(7).fill().map((_, dayIndex) => {
          const date = addDays(firstDayOfWeek, dayIndex);
          return { date, isSameMonth: isSameMonth(date, currentMonth) };
        })
      );
      return memo;
    }, []);

    return (
      <View style={[styles.month, style]}>
        <View style={styles.header}>
          <Hoverable>
            {isHovered => (
              <View onClick={this._handlePreviousMonth} style={[styles.day, isHovered && styles.hovered]}>
                <Text style={styles.text}>&larr;</Text>
              </View>
            )}
          </Hoverable>
          <View style={styles.monthHeader}>
            <Text style={styles.monthText}>{formatDate(currentMonth, 'MMMM')}</Text>
          </View>
          <Hoverable>
            {isHovered => (
              <View onClick={this._handleNextMonth} style={[styles.day, isHovered && styles.hovered]}>
                <Text style={styles.text}>&rarr;</Text>
              </View>
            )}
          </Hoverable>
        </View>
        <View style={styles.week}>
          {month[0].map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.text}>{formatDate(day.date, 'dd')}</Text>
            </View>
          ))}
        </View>
        {month.map((week, index) => (
          <View key={index} style={styles.week}>
            {week.map((day, index) => (
              <Hoverable key={index}>
                {isHovered => {
                  const inRange = day.date <= maxDate && day.date >= minDate;
                  return (
                    <View
                      onClick={inRange ? this._handleSelectDate(day) : noop}
                      style={[
                        styles.day,
                        inRange && onSelectDate && isHovered && styles.hovered,
                        selectedDate && isEqual(day.date, selectedDate) && styles.selected
                      ]}
                    >
                      <Text style={styles.text}>{formatDate(day.date, 'D')}</Text>
                    </View>
                  );
                }}
              </Hoverable>
            ))}
          </View>
        ))}
      </View>
    );
  }

  _handleSelectDate = (day: DayInfo) => () => {
    const { onSelectDate } = this.props;
    if (onSelectDate) {
      this.setState({ selectedDate: day.date });
      onSelectDate(day.date);
    }
  };

  _handleNextMonth = () => {
    this.setState(({ currentMonth }) => ({
      currentMonth: addMonths(currentMonth, 1)
    }));
  };

  _handlePreviousMonth = () => {
    this.setState(({ currentMonth }) => ({
      currentMonth: subMonths(currentMonth, 1)
    }));
  };
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row'
  },
  month: {
    flexDirection: 'column',
    width: 'auto'
  },
  monthHeader: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: `${5 / 7 * 100}%`
  },
  monthText: {
    textAlign: 'center'
  },
  week: {
    flexDirection: 'row'
  },
  day: {
    flexGrow: 1,
    flexBasis: `${1 / 7 * 100}%`,
    cursor: 'pointer',
    paddingHorizontal: theme.spaceXXSmall,
    paddingVertical: theme.spaceXXSmall
  },
  text: {
    wordWrap: 'normal'
  },
  hovered: {
    backgroundColor: theme.colorBlue
  },
  selected: {
    backgroundColor: theme.colorGreen
  }
});
