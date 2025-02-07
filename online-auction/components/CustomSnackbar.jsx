import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, useTheme, Text } from 'react-native-paper';

const CustomSnackbar = ({
  visible,
  onDismiss,
  position = 'bottom',
  message,
  duration = 3000,
  actionLabel,
  onActionPress,
  variant = 'default',
  style,
  textStyle,
  children
}) => {
  const theme = useTheme();
  const variantStyles = {
    success: { backgroundColor: '#4CAF50' },
    error: { backgroundColor: '#F44336' },
    warning: { backgroundColor: '#FF9800' },
    info: { backgroundColor: '#2196F3' },
    default: { backgroundColor: theme.colors.surface },
  };

  return (
    <View style={[styles.container, styles[position]]}>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        style={[
          styles.snackbar,
          variantStyles[variant],
          style,
        ]}
        wrapperStyle={styles.wrapper}
        action={{
          label: actionLabel,
          labelStyle: [styles.actionLabel, textStyle],
          onPress: onActionPress,
        }}
      >
        {children || <Text style={[styles.message, textStyle]}>{message}</Text>}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  top: {
    top: 40,
    alignSelf: 'center',
  },
  bottom: {
    bottom: 40,
    alignSelf: 'center',
  },
  'top-left': {
    top: 40,
    left: 20,
  },
  'top-right': {
    top: 40,
    right: 20,
  },
  'bottom-left': {
    bottom: 40,
    left: 20,
  },
  'bottom-right': {
    bottom: 40,
    right: 20,
  },
  snackbar: {
    borderRadius: 8,
    elevation: 4,
    minWidth: '80%',
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
  actionLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  wrapper: {
    position: 'relative',
  },
});

export default CustomSnackbar;