import { combineReducers } from "redux";

import selectedBand from './band';
import player from './player';

export default combineReducers({
  selectedBand,
  player,
});
