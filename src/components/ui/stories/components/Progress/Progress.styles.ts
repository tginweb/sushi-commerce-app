import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    position: 'absolute',
    top: 14,
    left: 16,
    height: 2,
    flexDirection: 'row',
    gap: 4,
    zIndex: 30000
  },
  item: {
    height: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
} );
