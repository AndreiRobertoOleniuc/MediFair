// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers"; // Import the root reducer

const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

//Example usage inside components
// const value = useAppSelector((state) => state.example.value);
// const dispatch = useAppDispatch();
{
  /* <Text>{value}</Text>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
      <Button
        onPress={() => dispatch(incrementByAmount(5))}
        title="Increment by 5"
      /> */
}
