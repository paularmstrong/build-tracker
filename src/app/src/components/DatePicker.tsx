/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import addDays from 'date-fns/add_days';
import addMonths from 'date-fns/add_months';
import ArrowLeftIcon from '../icons/ArrowLeft';
import ArrowRightIcon from '../icons/ArrowRight';
import Button from './Button';
import endOfMonth from 'date-fns/end_of_month';
import formatDate from 'date-fns/format';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isSameDay from 'date-fns/is_same_day';
import isSameMonth from 'date-fns/is_same_month';
import isToday from 'date-fns/is_today';
import React from 'react';
import RelativeModal from './RelativeModal';
import startOfMonth from 'date-fns/start_of_month';
import startOfToday from 'date-fns/start_of_today';
import startOfWeek from 'date-fns/start_of_week';
import subMonths from 'date-fns/sub_months';
import { StyleSheet, Text, View } from 'react-native';

interface Props extends React.ComponentProps<typeof RelativeModal> {
  minDate?: Date;
  maxDate?: Date;
  onSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const DatePicker = (props: Props): React.ReactElement => {
  const {
    maxDate = new Date(8640000000000000),
    minDate = new Date(-8640000000000000),
    onDismiss,
    onSelect,
    relativeTo,
    selectedDate = startOfToday()
  } = props;

  const [currentMonth, setCurrentMonth] = React.useState<Date>(startOfMonth(selectedDate));

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });

  // @ts-ignore
  const month = new Array(Math.ceil(daysInMonth / 7 + 2)).fill().reduce((memo, _week, weekIndex) => {
    const firstDayOfWeek = addDays(startDate, weekIndex * 7);
    if (weekIndex > 0 && !isSameMonth(firstDayOfWeek, currentMonth)) {
      return memo;
    }
    memo.push(
      // @ts-ignore
      new Array(7).fill().map((_, dayIndex) => {
        const date = addDays(firstDayOfWeek, dayIndex);
        return { date, isSameMonth: isSameMonth(date, currentMonth) };
      })
    );
    return memo;
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setCurrentMonth(currentMonth => addMonths(currentMonth, 1));
  }, []);

  const handlePreviousMonth = React.useCallback(() => {
    setCurrentMonth(currentMonth => subMonths(currentMonth, 1));
  }, []);

  return (
    <RelativeModal onDismiss={onDismiss} portalRootID="menuPortal" relativeTo={relativeTo}>
      <View style={[styles.month]}>
        <View style={styles.header}>
          <View style={styles.day}>
            <Button
              disabled={endOfMonth(subMonths(currentMonth, 1)) < minDate}
              icon={ArrowLeftIcon}
              iconOnly
              onPress={handlePreviousMonth}
              title="Previous month"
            />
          </View>
          <View style={styles.monthHeader}>
            <Text style={styles.monthText}>{formatDate(currentMonth, 'MMMM')}</Text>
          </View>
          <View style={styles.day}>
            <Button
              disabled={startOfMonth(addMonths(currentMonth, 1)) > maxDate}
              icon={ArrowRightIcon}
              iconOnly
              onPress={handleNextMonth}
              title="Next month"
            />
          </View>
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
            {week.map((day, index) => {
              const inRange = day.date <= maxDate && day.date >= minDate;
              const isSelected = isSameDay(day.date, selectedDate);
              const today = isToday(day.date);
              return (
                <View key={index} style={styles.day}>
                  <Button
                    accessibilityLabel={formatDate(day.date, 'YYYY-MM-DD')}
                    color={today ? 'secondary' : 'primary'}
                    disabled={!inRange}
                    onPress={() => {
                      onSelect(day.date);
                    }}
                    title={formatDate(day.date, 'D')}
                    type={isSelected ? 'unelevated' : 'text'}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </RelativeModal>
  );
};

const styles = StyleSheet.create({
  root: {},
  month: {
    padding: Theme.Spacing.Xsmall
  },
  header: {
    flexDirection: 'row'
  },
  day: {
    flexGrow: 1,
    flexBasis: `${(1 / 7) * 100}%`
  },
  hovered: {},
  monthHeader: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: `${(5 / 7) * 100}%`,
    justifyContent: 'center'
  },
  monthText: {
    textAlign: 'center',
    fontWeight: Theme.FontWeight.Bold
  },
  week: {
    flexDirection: 'row'
  },
  text: {
    textAlign: 'center'
  }
});

export default DatePicker;
