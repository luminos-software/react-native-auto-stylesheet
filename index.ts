import { Dimensions, ImageStyle, PixelRatio, StyleSheet as RNStyleSheet, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const { width, height } = Dimensions.get('window');

let guidelineBaseWidth = 375;
let guidelineBaseHeight = 667;
const horizontalFactor = width / guidelineBaseWidth;
const verticalFactor = height / guidelineBaseHeight;
const adimensionalFactor = (horizontalFactor + verticalFactor) / 2;

const PROPERTIES_DEPENDING_ON_WIDTH = [
  'width',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'borderLeftWidth',
  'borderRightWidth',
  'left',
  'right'
];
const PROPERTIES_DEPENDING_ON_HEIGHT = [
  'height',
  'marginTop',
  'marginBottom',
  'marginVertical',
  'paddingTop',
  'paddingBottom',
  'paddingVertical',
  'borderTopWidth',
  'borderBottomWidth',
  'top',
  'bottom'
];
const PROPERTIES_DEPENDING_ON_NEITHER = ['fontSize', 'margin', 'padding', 'borderWidth'];

export const StyleSheet = {
  ...RNStyleSheet,

  scaleHorizontally(size: number) {
    return size;
    return PixelRatio.roundToNearestPixel(size * horizontalFactor);
  },

  scaleVertically(size: number) {
    return size;
    return PixelRatio.roundToNearestPixel(size * verticalFactor);
  },

  scaleWithAverageRatio(size: number) {
    return size;
    return PixelRatio.roundToNearestPixel(size * adimensionalFactor);
  },

  create<T extends NamedStyles<T>>(styles: T) {
    for (const key in styles) {
      const style: ViewStyle | TextStyle | ImageStyle = styles[key];
      for (const property in style) {
        const propName = property as keyof (ViewStyle | TextStyle | ImageStyle);
        const value = style[propName];

        if (PROPERTIES_DEPENDING_ON_WIDTH.includes(propName) && typeof value === 'number') {
          style[propName] = this.scaleHorizontally(value);
        }
        if (PROPERTIES_DEPENDING_ON_HEIGHT.includes(propName) && typeof value === 'number') {
          style[propName] = this.scaleVertically(value);
        }
        if (PROPERTIES_DEPENDING_ON_NEITHER.includes(propName) && typeof value === 'number') {
          style[propName] = this.scaleWithAverageRatio(value);
        }
      }
    }

    return RNStyleSheet.create(styles);
  },

  setGuidelineBaseDimensions(newWidth = 375, newHeight = 667) {
    guidelineBaseWidth = newWidth;
    guidelineBaseHeight = newHeight;
  },

  createUnscaled: RNStyleSheet.create
};
