import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { endpoints } from '../../utils/config/config';


export interface authDataType {
  message: string | null;
  loading: boolean;
  token: string | null;
  statusCode: number;
  errorMsg:string,
  user:null,
  error:null,
  getClassData:[]
}

const initialState: authDataType = {
  message: null,
  loading: false,
  token: null,
  statusCode: 0,
  errorMsg:'',
  user:null,
  error:null,
  getClassData:[]
};
export interface networkStates {
  getState: Function;
  fulfillWithValue: Function;
  rejectWithValue: Function;
}


export const loginAction = createAsyncThunk(
  "auth/loginAction",
  async (
    { phone_number, password }: { phone_number: string | number; password: string },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await api.post(
        endpoints.LOGIN,
        { phone_number, password },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        }
      );

if (response.data?.message_type === "error") {
        return rejectWithValue({ message: response.data.message });
      }
      return fulfillWithValue(response.data);
    }catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || "Login failed",
      });
    }
  }
);

export const signUpAction = createAsyncThunk(
  "auth/signUp",
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await api.post(endpoints.SIGN_UP, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.data?.message_type === "error") {
        return rejectWithValue(response.data.message); 
      }
      return fulfillWithValue(response.data);
    } catch (err:any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

export const getClassNames = createAsyncThunk(
  'getClassNames',
  async (_, { getState, fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.get(endpoints.GET_CLASS);
      if (response) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'verifyOtp',
  async (
    { email,
    first_name,
    last_name,
    phone_number,
    address,
    zip_code,
    user_type,
    student_class,
    is_active,
    password,
    otp}: {
    email: string;phone_number:number, 
    first_name:string,
    last_name:string,
    address:string,
    zip_code:string|number,
    user_type:string,
    student_class:string|number,
    is_active:boolean,
    password:string,
    otp:string|number },
    { getState, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const data = {
        email,
    first_name,
    last_name,
    phone_number,
    address,
    zip_code,
    user_type,
    student_class,
    is_active,
    password,
    otp
      };
      const response = await api.post(endpoints.VERIFY_OTP, data, {
        headers: {
          'Content-Type': 'application/json',
           "Accept": "application/json",
        },
      });
      if (response) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  },
);

export const sendOtpPassword = createAsyncThunk(
  'sendOtpPassword',
  async ({ user }:{user:string}, { fulfillWithValue, rejectWithValue }) => {
    try {
      const data = { user };

      const response = await api.post(endpoints.FORGOT_PASSWORD, data, {
        headers: {
          'Content-Type': 'application/json',
           "Accept": "application/json",
        },
      });

      if (response) {
        return fulfillWithValue(response.data); 
      } else {
        return rejectWithValue('Something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  },
);


export const resetPassword = createAsyncThunk(
  'resetPassword',
  async (
    {
      email,
      new_password,
      confirm_new_password,
      otp
    }: {
      email: string | undefined;
      new_password: string;
      confirm_new_password: string;
      otp: string;
    },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const data = { email, otp, new_password, confirm_new_password };

      const response = await api.put(endpoints.FORGOT_PASSWORD, data, {
        headers: { 
        'Content-Type': 'application/json',
           "Accept": "application/json",
         },
      });

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log("Reset API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Reset failed" });
    }
  },
);


export const AuthSlice = createSlice({
  name: 'authlice',
  initialState,
  reducers: {
    restoreUserSession: (state, action) => {
      state.token = action.payload.token
    },
    actionLogout: state => {
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading = true;
      state.message = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
     console.log(action.payload,"action......==[ppS")
      state.message = null;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.message = 'Please try again!';
        state.errorMsg =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload)
    });
    builder.addCase(signUpAction.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(signUpAction.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.message = action.payload.message;
    });
    builder.addCase(signUpAction.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || "Signup failed";
    });
       builder.addCase(getClassNames.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getClassNames.fulfilled, (state, action) => {
      state.loading = false;
      state.getClassData = action.payload.data;
      console.log(state.getClassData,"==============getclass=============")
      state.message = action.payload.message;
    });
    builder.addCase(getClassNames.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || "Signup failed";
    });
      builder.addCase(resetPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.statusCode = action.payload.statusCode;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
    });
     builder.addCase(verifyOtp.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      if(action.payload.statusCode ==200){
        state.loading = false;
        state.token = action.payload?.data.token;
        state.statusCode = action.payload?.statusCode;
       }else {
        state.loading = false;
        state.errorMsg = action.payload;
       }
        state.message = action.payload.message;
        state.statusCode = action.payload?.statusCode
        state.token = action.payload?.data?.token
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.loading = false;
    });
       builder.addCase(sendOtpPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(sendOtpPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.statusCode = action.payload.statusCode;
    });
    builder.addCase(sendOtpPassword.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { actionLogout, restoreUserSession } = AuthSlice.actions;

export default AuthSlice.reducer;
