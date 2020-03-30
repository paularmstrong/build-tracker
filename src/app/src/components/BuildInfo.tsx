/**
 * Copyright (c) 2019 Paul Armstrong
 */
import { BuildMetaItem } from '@build-tracker/build';
import Button from './Button';
import CollapseIcon from '../icons/Collapse';
import { formatSha } from '@build-tracker/formatting';
import lightFormat from 'date-fns/lightFormat';
import React from 'react';
import RemoveIcon from '../icons/Remove';
import { State } from '../store/types';
import TabularMetadata from './TabularMetadata';
import { View } from 'react-native';
import { removeComparedRevision, setFocusedRevision } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  focusedRevision: string;
}

const buildMetaSort = ['revision', 'timestamp'];

function formatTimestamp(timestamp: number): string {
  const dateTime = new Date(parseInt(`${timestamp}000`, 10));
  return lightFormat(dateTime, 'yyyy-MM-dd hh:mm:ss a');
}

const BuildInfo = (props: Props): React.ReactElement => {
  const { focusedRevision } = props;

  const build = useSelector((state: State) =>
    state.comparator.builds.find((build) => build.getMetaValue('revision') === focusedRevision)
  );
  const revision = build.getMetaValue('revision');

  const dispatch = useDispatch();

  const handleClose = React.useCallback(() => {
    dispatch(setFocusedRevision(undefined));
  }, [dispatch]);

  const handleRemove = React.useCallback(() => {
    dispatch(removeComparedRevision(focusedRevision));
  }, [dispatch, focusedRevision]);

  const tableData = Object.keys(build.meta).reduce((memo: Array<[string, BuildMetaItem]>, metaKey: string): Array<
    [string, BuildMetaItem]
  > => {
    const sortIndex = buildMetaSort.indexOf(metaKey);
    const value = metaKey === 'timestamp' ? formatTimestamp(build.meta[metaKey]) : build.meta[metaKey];
    if (sortIndex >= 0) {
      memo.splice(sortIndex, 0, [metaKey, value]);
    } else {
      memo.push([metaKey, value]);
    }
    return memo;
  }, []);

  return (
    <View>
      <TabularMetadata
        closeButtonLabel="Collapse details"
        data={tableData}
        footer={
          <View>
            <Button color="secondary" icon={RemoveIcon} onPress={handleRemove} title="Remove build" />
          </View>
        }
        icon={CollapseIcon}
        onClose={handleClose}
        title={`Build: ${formatSha(revision)}`}
      />
    </View>
  );
};

export default BuildInfo;
