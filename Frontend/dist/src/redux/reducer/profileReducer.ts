import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  async ( { student_id, class_id }: { student_id: number; class_id: number }, {getState, fulfillWithValue, rejectWithValue }) => {
    try {
       const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const url = `${endpoints.STUDENT_PROFILE}/${student_id}/${class_id}/`;
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
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

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (
    {
      student_id,
      class_id,
      email,
      first_name,
      last_name,
      school,
      profile_image,
      phone_number,
      student_class,
   
    }: {
        student_id: number;
      class_id: number;
      email: string | undefined;
      first_name: string;
      last_name: string;
      school: null | string;
      profile_image: null | string;
      phone_number: string;
      student_class: number | string;
      student_packages: [];
    },
    {getState, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")
      
const formData = new FormData();
formData.append("first_name", first_name);
formData.append("email", email);
formData.append("phone_number", phone_number);
formData.append("student_class",student_class);
//formData.append("profile_image",profile_image);
//formData.append("profile_image", profile_image);

if (profile_image && profile_image.startsWith("file")) {
  formData.append("profile_image", {
    uri: profile_image,
    type: "image/jpeg", // or "image/png"
    name: "profile.jpg",
  } as any);
}
    //  if (!profile_image?.startsWith('http://') && profile_image) {
    //   formData.append('photo', {
    //     uri: profile_image,
    //     name: 'test.jpg',
    //     type: 'image/jpeg'
    //   })
    // }
     

//      if (profile_image && profile_image.startsWith("file")) {
//     formData.append("profile_image", {
//     uri: profile_image,
//     type: "image/jpeg",
//     name: "profile.jpg"
//   } as any);
// }
    const data = {
      email,
      first_name,
      last_name,
      school,
      profile_image,
      phone_number,
      student_class,
    };
      const url = `${endpoints.STUDENT_PROFILE}/${student_id}/${class_id}/`;
      const response = await api.put(url, formData, {
        headers: {
    "Content-Type": "multipart/form-data",
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
console.log(response,"===================response===================")
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

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { old_password, new_password }: { old_password: string; new_password: string },
    { getState, fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const storedToken = await AsyncStorage.getItem("access_token");
      const rawToken = state.auth?.token || storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

      const payload = { old_password, new_password };

      const response = await api.post(endpoints.CHANGE_PASSWORD, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response?.data) {
        return fulfillWithValue(response.data); // { message, message_type }
      } else {
        return rejectWithValue("No response from server");
      }
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue("No response from server");
      } else {
        return rejectWithValue(error.message);
      }
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
      state.getProfileData = action.payload?.data;
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
      console.log(action.payload.data,"updateddata===========")
      state.message =
        action.payload?.message || 'Profile updated successfully';
    });

    builder.addCase(updateProfile.rejected, state => {
      state.loading = false;
      state.message = 'Profile update failed';
    });
     builder
    .addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message; // from backend
    })
    .addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update password";
    });
  },
});

export const {} = ProfilSlice.actions;

export default ProfilSlice.reducer;
