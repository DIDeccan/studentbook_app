import { configureStore } from "@reduxjs/toolkit";
import themeSlice from '../reducer/themeReducer'
import  authReducer from "../reducer/authReducer";
import profileReducer from '../reducer/profileReducer'
import demoDataReducer from '../reducer/demopagereduce'
const store = configureStore({
  reducer: {
    theme:themeSlice,
    auth:authReducer,
    profile:profileReducer,
    demoData:demoDataReducer,
  },
});

export default store;