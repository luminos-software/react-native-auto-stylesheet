import { Dimensions, ImageStyle, PixelRatio, StyleSheet as RNStyleSheet, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

const { width, height } = Dimensions.get('window');

let guidelineBaseWidth = 375;
let guidelineBaseHeight = 667;
let scalingFactor: number = 1;

let horizontalFactor: number;
let verticalFactor: number;
let adimensionalFactor: number;

const calculateFactors = () => {
  horizontalFactor = (width / guidelineBaseWidth) * scalingFactor;
  verticalFactor = (height / guidelineBaseHeight) * scalingFactor;
  adimensionalFactor = (horizontalFactor + verticalFactor) / 2;
};
calculateFactors();

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
const PROPERTIES_DEPENDING_ON_NEITHER = ['fontSize', 'margin', 'padding', 'borderWidth', 'borderRadius'];
const PROPERTIES_AFFECTED = [
  ...PROPERTIES_DEPENDING_ON_WIDTH,
  ...PROPERTIES_DEPENDING_ON_HEIGHT,
  ...PROPERTIES_DEPENDING_ON_NEITHER
];

export type ScaleType = 'height' | 'width' | 'average';

export const StyleSheet = {
  ...RNStyleSheet,

  scale(size: number, scaleType: ScaleType) {
    switch (scaleType) {
      case 'height':
        return this.scaleVertically(size);
      case 'width':
        return this.scaleHorizontally(size);
      case 'average':
        return this.scaleWithAverageRatio(size);
    }
  },

  scaleHorizontally(size: number) {
    return PixelRatio.roundToNearestPixel(size * horizontalFactor);
  },

  scaleVertically(size: number) {
    return PixelRatio.roundToNearestPixel(size * verticalFactor);
  },

  scaleWithAverageRatio(size: number) {
    return PixelRatio.roundToNearestPixel(size * adimensionalFactor);
  },

  create<T extends NamedStyles<T>>(styles: T, scaleType?: ScaleType) {
    const newStyles: T = {} as T;

    for (const key in styles) {
      let style: ViewStyle | TextStyle | ImageStyle = styles[key];
      newStyles[key] = { ...style };

      for (const property in style) {
        const propName = property as keyof (ViewStyle | TextStyle | ImageStyle);
        const value = style[propName];

        if (scaleType) {
          if (PROPERTIES_AFFECTED.includes(propName) && typeof value === 'number') {
            newStyles[key][propName] = this.scale(value, scaleType);
          }
        } else {
          if (PROPERTIES_DEPENDING_ON_WIDTH.includes(propName) && typeof value === 'number') {
            newStyles[key][propName] = this.scaleHorizontally(value);
          }
          if (PROPERTIES_DEPENDING_ON_HEIGHT.includes(propName) && typeof value === 'number') {
            newStyles[key][propName] = this.scaleVertically(value);
          }
          if (PROPERTIES_DEPENDING_ON_NEITHER.includes(propName) && typeof value === 'number') {
            newStyles[key][propName] = this.scaleWithAverageRatio(value);
          }
        }
      }
    }

    return RNStyleSheet.create(newStyles);
  },

  setGuidelineBaseDimensions(newWidth = 375, newHeight = 667) {
    guidelineBaseWidth = newWidth;
    guidelineBaseHeight = newHeight;
    calculateFactors();
  },

  setFactor(factor: number) {
    scalingFactor = factor;
    calculateFactors();
  },

  createUnscaled: RNStyleSheet.create
};
