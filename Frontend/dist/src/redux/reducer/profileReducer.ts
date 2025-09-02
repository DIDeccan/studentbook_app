import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';

export interface authDataType {
  message: string | null;
  loading: boolean;
  token: string | null;
  statusCode: number;
  errorMsg: string;
  user: null;
  error: null;
  getProfileData: {};
  orderId: string | number;
}

const initialState: authDataType = {
  message: null,
  loading: false,
  token: null,
  statusCode: 0,
  errorMsg: '',
  user: null,
  error: null,
  getProfileData: {},
  orderId: '1234',
};
export interface networkStates {
  getState: Function;
  fulfillWithValue: Function;
  rejectWithValue: Function;
}

export const getProfile = createAsyncThunk(
  'getProfile',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NDc3MDIzLCJpYXQiOjE3NTY0NDQ2MjMsImp0aSI6ImRjNDRmODNjZTc4YzQ0YzNiMzgzNDNjMDRiMTY3MDE3IiwidXNlcl9pZCI6IjEwNyJ9.QW0L_cJ16EKzZd51RqhasueVwFYNpsyCSq_26fgjeGY';

      const response = await api.get(endpoints.STUDENT_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 send token here
        },
      });

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

// thunk
export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (
    {
      email,
      first_name,
      last_name,
      school,
      profile_image,
      is_active,
      phone_number,
      address,
      city,
      state,
      zip_code,
      user_type,
      student_class,
      student_packages,
    }: {
      email: string | undefined;
      first_name: string;
      last_name: string;
      school: null | string;
      profile_image: null | string;
      is_active: boolean;
      phone_number: string;
      address: string;
      city: null | string;
      state: null | string;
      zip_code: number;
      user_type: string;
      student_class: number | string;
      student_packages: [];
    },
    { fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NDc3MDIzLCJpYXQiOjE3NTY0NDQ2MjMsImp0aSI6ImRjNDRmODNjZTc4YzQ0YzNiMzgzNDNjMDRiMTY3MDE3IiwidXNlcl9pZCI6IjEwNyJ9.QW0L_cJ16EKzZd51RqhasueVwFYNpsyCSq_26fgjeGY';
      const formData = new FormData();
      formData.append('email', email);
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('school', school ?? '');
      formData.append('is_active', String(is_active));
      formData.append('phone_number', phone_number);
      formData.append('address', address ?? '');
      formData.append('city', city ?? '');
      formData.append('state', state ?? '');
      formData.append('zip_code', String(zip_code));
      formData.append('user_type', user_type);
      formData.append('student_class', String(student_class));
      formData.append('student_packages', JSON.stringify(student_packages));

      if (profile_image) {
        const file = {
          uri: profile_image,
          type: 'image/jpeg',
          name: 'profile.jpg',
        };
        formData.append('profile_image', file as any);
        console.log('Appended image:', file);
      }

      const response = await api.put(endpoints.STUDENT_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log(
        'Update Profile API Error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data || { message: 'Profile update failed' },
      );
    }
  },
); 

export const logoutAction = createAsyncThunk(
  "logoutAction",
  async (
    { refresh }: {refresh: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NDgwMzUxLCJpYXQiOjE3NTY0NDc5NTEsImp0aSI6IjBhOWRlNzUyMzU3MTQxNTBhMjdjZDNiZDdhOTE5NDVmIiwidXNlcl9pZCI6IjEwNyIsInVzZXJfdHlwZSI6InN0dWRlbnQifQ.Dp_kVsK7jmJi2Wb6lSeIz2L8-ynnmLu0HS48M6rzAG8"
      const response = await api.post(
        endpoints.LOGOUT, // 👈 Your backend logout endpoint
        {
          refresh: refresh, // many backends require refresh token for logout
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈 include access token
          },
        }
      );

      // Example: If backend sends `{ message: "Logout successful" }`
      if (response.data?.message) {
        return fulfillWithValue(response.data.message);
      } else {
        return fulfillWithValue("Logout successful");
      }
    } catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || "Logout failed",
      });
    }
  }
);


export const ProfilSlice = createSlice({
  name: 'ProfilSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProfile.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.getProfileData = action.payload;
      //state.getClassData = action.payload.data;
      // console.log(state.getProfileData,"==============getclass=============")
      // state.message = action.payload.message;
      state.message = 'Profile fetched successfully';
    });
    builder.addCase(getProfile.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'Signup failed';
    });

    builder.addCase(updateProfile.pending, state => {
      state.loading = true;
      state.message = null;
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      // backend message OR fallback success
      state.message =
        action.payload?.message || 'Profile updated successfully ✅';
    });

    builder.addCase(updateProfile.rejected, state => {
      state.loading = false;
      state.message = 'Profile update failed ❌';
    });

     builder.addCase(logoutAction.pending, state => {
      state.loading = true;
      state.message = null;
    });

    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.loading = false;
      // backend message OR fallback success
      state.message =
        action.payload?.message || "Logout is successfully";
    });

    builder.addCase(logoutAction.rejected, state => {
      state.loading = false;
      state.message = "Logout failed";
    });
  },
});

export const {} = ProfilSlice.actions;

export default ProfilSlice.reducer;
