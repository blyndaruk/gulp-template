import './helpers/_detectTouch';
import './polyfills/index';
import svg4everybody from 'svg4everybody';
import lazy from './modules/_lazy';

document.addEventListener('DOMContentLoaded', () => {
  svg4everybody(); // polyfill: true/false
  lazy()
});
