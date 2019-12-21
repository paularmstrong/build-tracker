/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../theme';
import BarChartIcon from '../icons/BarChart';
import Button from '../components/Button';
import ColorScalePicker from '../components/ColorScalePicker';
import DateTextField from '../components/DateTextField';
import Divider from '../components/Divider';
import DrawerLink from '../components/DrawerLink';
import endOfDay from 'date-fns/end_of_day';
import HeartIcon from '../icons/Heart';
import history from '../client/history';
import LineChartIcon from '../icons/LineChart';
import Logo from '../icons/Logo';
import OpenInExternalIcon from '../icons/OpenInExternal';
import SizeKeyPicker from '../components/SizeKeyPicker';
import startOfDay from 'date-fns/start_of_day';
import Subtitle from '../components/Subtitle';
import TextField from '../components/TextField';
import { clearComparedRevisions, setDisabledArtifactsVisible, setGraphType } from '../store/actions';
import Drawer, { Handles as DrawerHandles } from '../components/Drawer';
import { GraphType, State } from '../store/types';
import React, { FunctionComponent } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const today = new Date();

const DrawerView: FunctionComponent<{}> = (_props: {}, ref: React.RefObject<DrawerHandles>): React.ReactElement => {
  const comparator = useSelector((state: State) => state.comparator);
  const disabledArtifactsVisible = useSelector((state: State) => state.disabledArtifactsVisible);
  const graphType = useSelector((state: State) => state.graphType);
  const hideAttribution = useSelector((state: State) => state.hideAttribution);

  const dispatch = useDispatch();

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleToggleDisabled = React.useCallback(
    (showDisabled: boolean): void => {
      dispatch(setDisabledArtifactsVisible(showDisabled));
    },
    [dispatch]
  );

  const handleSetDateRange = React.useCallback((): void => {
    const startTimestamp = Math.floor(startOfDay(startDate).valueOf() / 1000);
    const endTimestamp = Math.floor(endOfDay(endDate).valueOf() / 1000);
    dispatch(clearComparedRevisions());
    history.push(`/builds/dates/${startTimestamp}..${endTimestamp}`);
  }, [startDate, endDate, dispatch]);

  const [buildCountValue, setBuildCountValue] = React.useState<string>('');
  const handleSetLastNBuilds = React.useCallback((): void => {
    dispatch(clearComparedRevisions());
    history.push(buildCountValue ? `/builds/limit/${buildCountValue}` : '/');
  }, [buildCountValue, dispatch]);

  const handleSetGraphArea = React.useCallback((): void => {
    dispatch(setGraphType(GraphType.AREA));
  }, [dispatch]);
  const handleSetGraphBar = React.useCallback((): void => {
    dispatch(setGraphType(GraphType.STACKED_BAR));
  }, [dispatch]);

  return (
    <Drawer hidden ref={ref}>
      <View style={styles.header}>
        <Logo style={styles.logo} />
        <Text style={styles.title}>Build Tracker</Text>
      </View>

      <Divider style={styles.divider} />

      <Subtitle title="Get latest builds" />
      <TextField
        keyboardType="numeric"
        label="Number of builds"
        onChangeText={setBuildCountValue}
        style={styles.textinput}
        value={buildCountValue}
      />
      <Button onPress={handleSetLastNBuilds} title="Get builds" type="unelevated" />

      <Divider style={styles.divider} />

      <Subtitle title="Date range" />
      <DateTextField maxDate={endDate || today} label="Start date" onSet={setStartDate} style={styles.textinput} />
      <DateTextField minDate={startDate} maxDate={today} label="End date" onSet={setEndDate} style={styles.textinput} />
      <View style={styles.date}>
        <Button disabled={!startDate || !endDate} onPress={handleSetDateRange} title="Get range" type="unelevated" />
      </View>

      <Divider style={styles.divider} />

      {comparator.sizeKeys.length > 1 ? (
        <>
          <Subtitle title="Compare artifacts by" />
          <SizeKeyPicker keys={comparator.sizeKeys} />
          <Divider style={styles.divider} />
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

      <Divider style={styles.divider} />

      <View style={styles.buttonRow}>
        <Button
          disabled={graphType === GraphType.AREA}
          icon={LineChartIcon}
          onPress={handleSetGraphArea}
          title="Area"
          type={graphType === GraphType.AREA ? 'unelevated' : 'text'}
        />
        <Button
          disabled={graphType === GraphType.STACKED_BAR}
          icon={BarChartIcon}
          onPress={handleSetGraphBar}
          title="Stacked Bar"
          type={graphType === GraphType.STACKED_BAR ? 'unelevated' : 'text'}
        />
      </View>

      <Divider style={styles.divider} />

      <Subtitle title="Color scale" />
      <ColorScalePicker />
      <Divider style={styles.divider} />
      <View style={styles.footer}>
        <Subtitle title="Links" />
        <DrawerLink href="https://buildtracker.dev" icon={OpenInExternalIcon} text="Documentation" />
        <DrawerLink href="https://github.com/paularmstrong/build-tracker" icon={OpenInExternalIcon} text="Github" />
      </View>
      {hideAttribution ? null : (
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
      )}
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
  divider: {
    marginBottom: Theme.Spacing.Normal
  },
  switchRoot: {
    flexDirection: 'row',
    marginBottom: Theme.Spacing.Normal
  },
  switch: {
    marginEnd: Theme.Spacing.Small
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginBottom: Theme.Spacing.Normal
  },
  textinput: {
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

// @ts-ignore
export default React.forwardRef(DrawerView);
