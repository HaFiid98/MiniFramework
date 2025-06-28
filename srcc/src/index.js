import { createElement, render, diff, patch } from './core/dom';
import { setState, getState, subscribe } from './core/state';
import { addRoute, navigate, initRouter } from './core/router';
import { addevent, delevent } from './core/events';

export default {
  // DOM methods
  createElement,
  render,
  diff,
  patch,
  
  // Events
  addevent,
  delevent
};