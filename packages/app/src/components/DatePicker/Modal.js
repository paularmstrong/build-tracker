// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import DatePicker from './';
import { StyleSheet } from 'react-native';
import theme from '../../theme';

type Props = {
  ...React.ElementConfig<typeof DatePicker>,
  relativeTo: React.ElementRef<*>
};

type State = {
  rect: ?ClientRect
};

const modalRoot = document.getElementById('modalRoot');

export default class ModalDatePicker extends React.Component<Props, State> {
  _el: HTMLElement;

  constructor(props: Props, context: any) {
    super(props, context);
    this._el = document.createElement('div');
    const relativeNode = ReactDOM.findDOMNode(props.relativeTo);
    const rect =
      relativeNode && typeof relativeNode.getBoundingClientRect === 'function'
        ? relativeNode.getBoundingClientRect()
        : null;

    this.state = { rect };
  }

  componentDidMount() {
    modalRoot && modalRoot.appendChild(this._el);
  }

  componentWillUnmount() {
    modalRoot && modalRoot.removeChild(this._el);
  }

  render() {
    const { style, ...props } = this.props;
    const { rect } = this.state;
    return rect
      ? ReactDOM.createPortal(
          <DatePicker
            {...props}
            style={[style, styles.root, { top: `${rect.top + rect.height}px`, left: `${rect.left}px` }]}
          />,
          this._el
        )
      : null;
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colorWhite,
    position: 'absolute',
    zIndex: 1
  }
});
