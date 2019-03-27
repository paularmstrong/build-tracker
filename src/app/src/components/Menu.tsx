/**
 * Copyright (c) 2019 Paul Armstrong
 */
import MenuItem from './MenuItem';
import React from 'react';
import RelativeModal from './RelativeModal';

interface Props extends React.ComponentProps<typeof RelativeModal> {
  children: React.ReactElement<typeof MenuItem> | Array<React.ReactElement<typeof MenuItem>>;
}

const Menu = (props: Props): React.ReactElement => {
  return <RelativeModal {...props} accessibilityRole="menu" portalRootID="menuPortal" />;
};

export default Menu;
