// store/reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import exampleReducer from "./exampleReducer"; // Import your individual reducers

const rootReducer = combineReducers({
  example: exampleReducer,
  // Add other reducers here
});

export default rootReducer;
