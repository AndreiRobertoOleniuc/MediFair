// store/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import documentReducer from "./documentReducer"; // Import your individual reducers

const rootReducer = combineReducers({
  document: documentReducer,
});

export default rootReducer;
