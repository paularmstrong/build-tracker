// @flow
import { StyleSheet } from 'react-native';
import theme from '../../theme';

export const getHeaderTopPos = (i: number) => {
  const height = theme.spaceLarge;
  const cellHeight = parseFloat(height.replace('rem', ''));
  // Hack to accommodate calc rounding errors
  const borderSize = 1 + i * 0.25;
  // (2x border size * num) + (cellHeight * num)
  return `calc(${2 * borderSize * i}px + ${cellHeight * i}rem)`;
};

const styles = StyleSheet.create({
  root: {
    position: 'relative'
  },
  dataTable: {
    fontSize: theme.fontSizeSmall,
    borderCollapse: 'collapse'
  },
  header: {
    position: 'sticky',
    top: getHeaderTopPos(0),
    zIndex: 2,
    boxShadow: `0px 0px 0px 0.5px ${theme.colorGray}`
  },
  rowHeader: {
    textAlign: 'left',
    paddingRight: theme.spaceXXSmall
  },
  rowColor: {
    display: 'inline-flex',
    width: '1em',
    height: '1em',
    borderRadius: '50%',
    marginLeft: theme.spaceXSmall
  },
  artifactLink: {
    display: 'inline-flex',
    fontWeight: 'normal'
  },
  cell: {
    boxSizing: 'border-box',
    backgroundColor: theme.colorWhite,
    margin: 0,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colorGray,
    borderRightWidth: '1px',
    borderRightStyle: 'dotted',
    borderRightColor: theme.colorGray
  },
  cellContent: {
    display: 'block',
    height: theme.spaceLarge,
    maxHeight: theme.spaceLarge,
    overflow: 'hidden'
  },
  cellValue: {
    lineHeight: theme.spaceLarge,
    whiteSpace: 'nowrap',
    wordWrap: 'unset'
  },
  toggle: {
    color: theme.colorBlue,
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    flexDirection: 'row'
  },
  stickyColumn: {
    left: 0,
    position: 'sticky',
    top: 'auto',
    maxWidth: '13rem',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: theme.colorGray,
    zIndex: 3,
    boxShadow: `0px 0px 0px 0.5px ${theme.colorGray}`
  },
  stickyColumnStickyHeader: {
    zIndex: 4
  },
  stickyBlankHeader: {
    position: 'sticky',
    top: 0,
    left: 0,
    zIndex: 4
  },
  headerContent: {
    flexDirection: 'row'
  },
  headerSha: {
    cursor: 'pointer',
    zIndex: 5
  },
  headerShaHovered: {
    color: theme.colorGreen
  },
  headerButton: {
    marginLeft: theme.spaceXSmall,
    cursor: 'pointer',
    fontSize: '0.5rem',
    color: theme.colorRed
  },
  copyButton: {
    marginLeft: theme.spaceSmall
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: theme.spaceMedium
  }
});

export default styles;
