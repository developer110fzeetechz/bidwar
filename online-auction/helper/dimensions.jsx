import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * Get dynamic height based on percentage
 * @param {number} percentage - The percentage of the screen height
 * @returns {number} - The calculated height in pixels
 */
export const heightPerHeight = (percentage) => (height * percentage) / 100;

/**
 * Get dynamic width based on percentage
 * @param {number} percentage - The percentage of the screen width
 * @returns {number} - The calculated width in pixels
 */
export const widthPerWidth = (percentage) => (width * percentage) / 100;
