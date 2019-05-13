/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import Button from '../components/Button';
import ColorScalePicker from '../components/ColorScalePicker';
import DateTextField from '../components/DateTextField';
import Divider from '../components/Divider';
import Drawer from '../components/Drawer';
import DrawerLink from '../components/DrawerLink';
import endOfDay from 'date-fns/end_of_day';
import HeartIcon from '../icons/Heart';
import Logo from '../icons/Logo';
import OpenInExternalIcon from '../icons/OpenInExternal';
import React from 'react';
import SizeKeyPicker from '../components/SizeKeyPicker';
import startOfDay from 'date-fns/start_of_day';
import { State } from '../store/types';
import Subtitle from '../components/Subtitle';
import { setDateRange, setDisabledArtifactsVisible } from '../store/actions';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useDispatch, useMappedState } from 'redux-react-hook';

interface MappedState {
  comparator: State['comparator'];
  disabledArtifactsVisible: State['disabledArtifactsVisible'];
  storeEnd: Date;
  storeStart: Date;
}

const today = new Date();

const mapState = (state: State): MappedState => ({
  comparator: state.comparator,
  disabledArtifactsVisible: state.disabledArtifactsVisible,
  storeEnd: state.dateRange ? state.dateRange.end : null,
  storeStart: state.dateRange ? state.dateRange.start : null
});

const DrawerView = (_props: {}, ref: React.RefObject<Drawer>): React.ReactElement => {
  const { comparator, disabledArtifactsVisible, storeEnd, storeStart } = useMappedState(mapState);
  const dispatch = useDispatch();

  const [startDate, setStartDate] = React.useState<Date>(storeStart);
  const [endDate, setEndDate] = React.useState<Date>(storeEnd);

  const handleToggleDisabled = React.useCallback(
    (showDisabled: boolean): void => {
      dispatch(setDisabledArtifactsVisible(showDisabled));
    },
    [dispatch]
  );

  const handleSetDateRange = React.useCallback((): void => {
    dispatch(setDateRange(startOfDay(startDate), endOfDay(endDate)));
  }, [dispatch, startDate, endDate]);

  return (
    <Drawer hidden ref={ref}>
      <View style={styles.header}>
        <Logo style={styles.logo} />
        <Text style={styles.title}>Build Tracker</Text>
      </View>

      <Divider />

      <Subtitle title="Date range" />
      <DateTextField maxDate={endDate || today} label="Start date" onSet={setStartDate} style={styles.date} />
      <DateTextField minDate={startDate} maxDate={today} label="End date" onSet={setEndDate} style={styles.date} />
      <View style={styles.date}>
        <Button disabled={!startDate || !endDate} onPress={handleSetDateRange} title="Get range" type="unelevated" />
      </View>

      <Divider />

      {comparator.sizeKeys.length > 1 ? (
        <>
          <Subtitle title="Compare artifacts by" />
          <SizeKeyPicker keys={comparator.sizeKeys} />
          <Divider />
        </>
      ) : null}

      <View style={styles.switchRoot}>
        {
          // @ts-ignore
          <Switch
            activeThumbColor={Theme.Color.Primary30}
            activeTrackColor={Theme.Color.Primary00}
            onValueChange={handleToggleDisabled}
            style={styles.switch}
            value={disabledArtifactsVisible}
          />
        }
        <Text>Show disabled artifacts</Text>
      </View>

      <Divider />

      <Subtitle title="Color scale" />
      <ColorScalePicker />
      <Divider />
      <View style={styles.footer}>
        <Subtitle title="Links" />
        <DrawerLink href="https://github.com/paularmstrong/build-tracker" icon={OpenInExternalIcon} text="Github" />
      </View>
      <View style={styles.attribution}>
        <Text style={styles.attrText}>
          Created with <HeartIcon accessibilityLabel="love" style={styles.heart} /> by{' '}
          {
            // @ts-ignore
            <Text accessibilityRole="link" href="https://twitter.com/paularmstrong" target="_blank">
              Paul Armstrong
            </Text>
          }
        </Text>
      </View>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: Theme.Spacing.Large
  },
  logo: {
    height: Theme.FontSize.Xlarge,
    marginEnd: Theme.Spacing.Small
  },
  // @ts-ignore
  title: {
    color: Theme.Color.Primary40,
    fontWeight: Theme.FontWeight.Bold,
    fontSize: Theme.FontSize.Large
  },
  switchRoot: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.Normal
  },
  switch: {
    marginEnd: Theme.Spacing.Small
  },
  date: {
    marginBottom: Theme.Spacing.Small
  },
  attribution: {
    paddingVertical: Theme.Spacing.Large,
    flexDirection: 'row'
  },
  attrText: {
    width: '100%'
  },
  heart: {
    color: Theme.Color.Secondary30
  }
});

export default React.forwardRef(DrawerView);
