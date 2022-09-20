import { combineReducers } from '@reduxjs/toolkit';

import terminal from '../features/Terminal/Terminal.slice';
import keypad from '../layouts/Keypad/Keypad.slice';
import graph from '../features/Graph/Graph.slice';

export default combineReducers({terminal, keypad, graph})
