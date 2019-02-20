import * as Theme from '../theme';
import AppBar from '../components/AppBar';
import ComparisonTable from '../components/ComparisonTable';
import Drawer from '../components/Drawer';
import MenuIcon from '../icons/Menu';
import React from 'react';
import Subtitle from '../components/Subtitle';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Main = (): React.ReactElement => {
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);

  const showDrawer = (): void => {
    drawerRef.current && drawerRef.current.show();
  };

  return (
    <View style={styles.layout}>
      <Drawer hidden ref={drawerRef}>
        <Subtitle title="Build Tracker" />
      </Drawer>
      <View
        // @ts-ignore
        accessibilityRole="main"
        style={styles.main}
      >
        <View style={[styles.column, styles.chart]}>
          <AppBar navigationIcon={MenuIcon} onPressNavigationIcon={showDrawer} title="Build Tracker" />
          <View key="chart" />
        </View>
        <View key="table" style={[styles.column, styles.table]}>
          <ScrollView horizontal style={styles.tableScroll}>
            <ScrollView>
              <ComparisonTable builds={[]} />
            </ScrollView>
          </ScrollView>
          <View style={styles.buildInfo}>
            <Text>Placeholder: Build Info</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden'
  },
  main: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: '100vh',
    width: '100vw'
  },
  column: {
    flexGrow: 3,
    flexShrink: 1,
    height: '100vh',
    alignItems: 'flex-start'
  },
  chart: {
    flexDirection: 'column'
  },
  table: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    maxWidth: '40vw',
    borderLeftColor: Theme.Color.Gray10,
    borderLeftWidth: StyleSheet.hairlineWidth
  },
  tableScroll: {
    width: '100%'
  },
  buildInfo: {
    width: '100%',
    borderTopColor: Theme.Color.Gray10,
    borderTopWidth: StyleSheet.hairlineWidth
  }
});

export default Main;
