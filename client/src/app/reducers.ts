import { combineReducers } from '@reduxjs/toolkit';

import terminal from '../features/Terminal/Terminal.slice';
import keypad from '../layouts/Keypad/Keypad.slice';

export default combineReducers({terminal, keypad})
