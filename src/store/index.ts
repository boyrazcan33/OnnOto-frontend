import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import stationsSlice from './stationsSlice';
import filtersSlice from './filtersSlice';
import reliabilitySlice from './reliabilitySlice';
import connectorsSlice from './connectorsSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    stations: stationsSlice,
    filters: filtersSlice,
    reliability: reliabilitySlice,
    connectors: connectorsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;