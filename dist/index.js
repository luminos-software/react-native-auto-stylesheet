"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { width, height } = react_native_1.Dimensions.get('window');
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
exports.StyleSheet = Object.assign({}, react_native_1.StyleSheet, { scaleHorizontally(size) {
        return size;
        return react_native_1.PixelRatio.roundToNearestPixel(size * horizontalFactor);
    },
    scaleVertically(size) {
        return size;
        return react_native_1.PixelRatio.roundToNearestPixel(size * verticalFactor);
    },
    scaleWithAverageRatio(size) {
        return size;
        return react_native_1.PixelRatio.roundToNearestPixel(size * adimensionalFactor);
    },
    create(styles) {
        for (const key in styles) {
            const style = styles[key];
            for (const property in style) {
                const propName = property;
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
        return react_native_1.StyleSheet.create(styles);
    },
    setGuidelineBaseDimensions(newWidth = 375, newHeight = 667) {
        guidelineBaseWidth = newWidth;
        guidelineBaseHeight = newHeight;
    }, createUnscaled: react_native_1.StyleSheet.create });
