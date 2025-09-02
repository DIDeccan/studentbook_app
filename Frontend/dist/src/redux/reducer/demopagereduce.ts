import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';

export interface authDataType {
  message: string | null;
  loading: boolean;
  errorMsg: string;
  error: null;
  getDemoVideosData:[];
}

const initialState: authDataType = {
  message: null,
  loading: false,
  errorMsg: '',
  error: null,
  getDemoVideosData:[]
};
export interface networkStates {
  getState: Function;
  fulfillWithValue: Function;
  rejectWithValue: Function;
}

export const getDemoData = createAsyncThunk(
  'getDemoData',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.DEMO_VIDEOS, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      return fulfillWithValue(response.data); 
    } catch (error: any) {
      console.log('getDemoData error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Request failed');
    }
  }
);


export const DemoSlice = createSlice({
  name: 'DemoSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {

   builder.addCase(getDemoData.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.message = null;
});

builder.addCase(getDemoData.fulfilled, (state, action) => {
  state.loading = false;
  // API sends { message, message_type, data }
  state.getDemoVideosData = action.payload; 
  state.message = action.payload.message || "Fetched successfully";
//   console.log("Classes =>", state.getDemoVideosData);
});

builder.addCase(getDemoData.rejected, (state, action: any) => {
  state.loading = false;
  state.error = action.payload || "Request failed";
});

  },
});

export const {} = DemoSlice.actions;

export default DemoSlice.reducer;
