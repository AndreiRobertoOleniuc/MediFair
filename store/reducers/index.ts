// store/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import documentReducer from "./docuemtReducer"; // Import your individual reducers

const rootReducer = combineReducers({
  document: documentReducer,
  // Add other reducers here
});

export default rootReducer;
