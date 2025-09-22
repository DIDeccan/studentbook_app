import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface authDataType {
  message: string | null;
  loading: boolean;
  errorMsg: string;
  error: null;
  getDemoVideosData:[];
  mainContentData:[];
  subjectsData:[]
  subjectVideosData:[]
}

const initialState: authDataType = {
  message: null,
  loading: false,
  errorMsg: '',
  error: null,
  getDemoVideosData:[],
  mainContentData:[],
  subjectsData:[],
  subjectVideosData:[]
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
     // console.log('getDemoData error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Request failed');
    }
  }
);

export const MainContentHome = createAsyncThunk(
  'MainContentHome',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.MAIN_CONTENT}/${student_id}/${class_id}`;
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

export const SubjectsApi = createAsyncThunk(
  'SubjectsApi',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.SUBJECTDATA}/${student_id}/${class_id}`;
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

export const subjectVideosApi = createAsyncThunk(
  'subjectVideosApi',
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.SUBJECT_VIDEOS}/${student_id}/${class_id}`;
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
  builder.addCase(MainContentHome.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(MainContentHome.fulfilled, (state, action) => {
      state.loading = false;
      state.mainContentData = action.payload?.data;
      console.log(state.mainContentData,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(MainContentHome.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });

     builder.addCase(SubjectsApi.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(SubjectsApi.fulfilled, (state, action) => {
      state.loading = false;
      state.subjectsData = action.payload?.data;
      console.log(state.subjectsData,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(SubjectsApi.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });

     builder.addCase(subjectVideosApi.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(subjectVideosApi.fulfilled, (state, action) => {
      state.loading = false;
      state.subjectVideosData = action.payload?.data;
      console.log(state.subjectVideosData,"=====================dashboardGetdata==========")
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(subjectVideosApi.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'getting data failed';
    });

  },
});

export const {} = DemoSlice.actions;

export default DemoSlice.reducer;
