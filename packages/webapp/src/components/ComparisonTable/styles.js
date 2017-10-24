import { StyleSheet } from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
  root: {
    position: 'relative'
  },
  dataTable: {
    fontSize: theme.fontSizeSmall,
    borderSpacing: 0,
    borderCollapse: 'separate'
  },
  header: {
    position: 'sticky',
    top: 0,
    left: 'auto',
    zIndex: 2
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
  bundleLink: {
    display: 'inline-flex',
    fontWeight: 'normal'
  },
  cell: {
    backgroundColor: theme.colorWhite,
    margin: 0,
    paddingLeft: theme.spaceXSmall,
    paddingRight: theme.spaceXSmall,
    verticalAlign: 'middle',
    height: theme.spaceLarge,
    textAlign: 'right',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.colorGray,
    borderRightWidth: '1px',
    borderRightStyle: 'dotted',
    borderRightColor: theme.colorGray,
    whiteSpace: 'nowrap'
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
    zIndex: 1
  },
  headerContent: {
    flexDirection: 'row'
  },
  headerSha: {
    cursor: 'pointer'
  },
  headerButton: {
    marginLeft: theme.spaceXSmall,
    cursor: 'pointer',
    fontSize: '0.5rem'
  },
  removeBuild: {
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
