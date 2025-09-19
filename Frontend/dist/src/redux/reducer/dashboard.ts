import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface authDataType {
  message: string | null;
  loading: boolean;
  statusCode: number;
  errorMsg: string;
  user: null;
  error: null;
  dashboardGetdata: {} | any;
  dashboardInterestTopic:{},
  dashboardWeekilyTopics:{}
}

const initialState: authDataType = {
  message: null,
  loading: false,
  statusCode: 0,
  errorMsg: '',
  user: null,
  error: null,
  dashboardGetdata: {},
  dashboardInterestTopic:{},
  dashboardWeekilyTopics:{}
};
export interface networkStates {
  getState: Function;
  fulfillWithValue: Function;
  rejectWithValue: Function;
}

export const getDashBoardData = createAsyncThunk(
  'getDashBoardData',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.DASHBOARD}/${student_id}/${class_id}`;
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
//console.log(response,"=================res===============")
      if (response) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error: any) {
      console.log('getProfile error:', error);
      return rejectWithValue(error.message || 'Request failed');
    }
  },
);

export const getDBInterestTopic = createAsyncThunk(
  'getDBInterestTopic',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.DASHBARD_INTEREST}/${student_id}/${class_id}`;
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
//console.log(response,"=================res===============")
      if (response) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error: any) {
      console.log('getProfile error:', error);
      return rejectWithValue(error.message || 'Request failed');
    }
  },
);

export const getDBWeeklyTrends = createAsyncThunk(
  'getDBWeeklyTrends',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.DASHBOARD_WEEKLY_TRENDS}/${student_id}/${class_id}`;
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
//console.log(response,"=================res===============")
      if (response) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error: any) {
      console.log('getProfile error:', error);
      return rejectWithValue(error.message || 'Request failed');
    }
  },
);


export const DashBoardSlice = createSlice({
  name: 'DashBoardSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getDashBoardData.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getDashBoardData.fulfilled, (state, action) => {
      state.loading = false;
      state.dashboardGetdata = action.payload?.data;
     // console.log(state.dashboardGetdata,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(getDashBoardData.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });

     builder.addCase(getDBInterestTopic.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getDBInterestTopic.fulfilled, (state, action) => {
      state.loading = false;
      state.dashboardInterestTopic = action.payload?.data;
     // console.log(state.dashboardGetdata,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(getDBInterestTopic.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });
     builder.addCase(getDBWeeklyTrends.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getDBWeeklyTrends.fulfilled, (state, action) => {
      state.loading = false;
      state.dashboardWeekilyTopics = action.payload?.data;
     // console.log(state.dashboardGetdata,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(getDBWeeklyTrends.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });
 }
});

export const {} = DashBoardSlice.actions;

export default DashBoardSlice.reducer;
