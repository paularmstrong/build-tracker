/**
 * Copyright (c) 2019 Paul Armstrong
 */
import * as Theme from '../../theme';
import MenuItem from './Item';
import React from 'react';
import ReactDOM from 'react-dom';
import { ScrollView, StyleSheet, View } from 'react-native';

interface Props {
  children: React.ReactElement<typeof MenuItem> | Array<React.ReactElement<typeof MenuItem>>;
  onDismiss?: () => void;
  relativeTo: React.RefObject<View>;
}

const Menu = (props: Props): React.ReactElement => {
  const { children, onDismiss, relativeTo } = props;
  const [position, setPosition] = React.useState({ top: -999, left: 0 });
  const portalRoot = document.getElementById('menuPortal');
  const ref = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    const handleClickOutside = (): void => {
      onDismiss && onDismiss();
    };
    document.body.addEventListener('click', handleClickOutside);

    if (relativeTo.current) {
      relativeTo.current.measureInWindow(
        (x: number, y: number, _: number, height: number): void => {
          ref.current && setPosition({ top: y + height, left: x });
        }
      );
    }

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

  const menu = (
    <ScrollView
      // @ts-ignore
      accessibilityRole="menu"
      ref={ref}
      style={[styles.root, { top: position.top, left: position.left }]}
    >
      {React.Children.toArray(children)}
    </ScrollView>
  );

  return portalRoot ? ReactDOM.createPortal(menu, portalRoot) : menu;
};

const styles = StyleSheet.create({
  root: {
    // @ts-ignore
    position: 'absolute',
    backgroundColor: Theme.Color.White,
    borderRadius: Theme.BorderRadius.Normal,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: Theme.Color.Black,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    width: 'auto',
    maxHeight: 400,
    minHeight: '2rem',
    minWidth: 200
  }
});

export default Menu;
