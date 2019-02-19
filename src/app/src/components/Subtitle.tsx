import * as React from 'react';
import * as Theme from '../theme';
import { StyleSheet, Text } from 'react-native';

interface Props {
  title: string;
}

const Subtitle = (props: Props): React.ReactElement => {
  const { title } = props;
  return (
    <Text
      // @ts-ignore
      style={styles.subtitle}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  // @ts-ignore
  subtitle: {
    color: Theme.Color.Gray40,
    fontSize: Theme.FontSize.Normal,
    marginHorizontal: Theme.Spacing.Normal,
    marginBottom: Theme.Spacing.Xsmall,
    paddingHorizontal: Theme.Spacing.Small
  }
});

export default Subtitle;
