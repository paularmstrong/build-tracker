import MenuIcon from '../icons/Menu';
import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';
import React from 'react';
import Subtitle from '../components/Subtitle';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView, StyleSheet, View } from 'react-native';

const Main = (): React.ReactElement => {
  const appBarRef: React.RefObject<AppBar> = React.useRef(null);
  const drawerRef: React.RefObject<Drawer> = React.useRef(null);

  const handleScrollContent = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const {
      nativeEvent: {
        contentOffset: { y }
      }
    } = event;

    appBarRef.current && appBarRef.current.setYScrollPosition(y);
  };

  const showDrawer = (): void => {
    drawerRef.current && drawerRef.current.show();
  };

  return (
    <View style={styles.layout}>
      <Drawer hidden ref={drawerRef}>
        <Subtitle title="Build Tracker" />
      </Drawer>
      <ScrollView onScroll={handleScrollContent} scrollEventThrottle={100} scrollEnabled style={styles.content}>
        <AppBar navigationIcon={MenuIcon} onPressNavigationIcon={showDrawer} title="Build Tracker" ref={appBarRef} />
        <View
          // @ts-ignore
          accessibilityRole="main"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    height: '100vh',
    overflow: 'hidden'
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: '100%'
  }
});

export default Main;
