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
  getClassData: any[];
  orderId: string | number;
  accessToken: string | null;
  refreshToken: string | null;
  message_type:string,
  checkPayment:boolean
}

const initialState: authDataType = {
  message: null,
  loading: false,
  token: null,
  statusCode: 0,
  errorMsg: '',
  user: null,
  error: null,
  getClassData: [],
  orderId: '',
  accessToken: null,
  refreshToken: null,
  message_type:'',
  checkPayment:false
};
export interface networkStates {
  getState: Function,
  fulfillWithValue: Function,
  rejectWithValue: Function
}

export const loginAction = createAsyncThunk(
  'auth/loginAction',
  async (
    {
      phone_number,
      password,
    }: { phone_number: string | number; password: string },
    { rejectWithValue, fulfillWithValue },
  ) => {
    try {
      const response = await api.post(
        endpoints.LOGIN,
        { phone_number, password },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (response.data?.message_type === 'error') {
        return rejectWithValue({ message: response.data.message });
      }
      return fulfillWithValue(response.data);
    } catch (err: any) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Login failed',
      });
    }
  },
);

export const signUpAction = createAsyncThunk(
  'auth/signUp',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await api.post(endpoints.SIGN_UP, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (response.data?.message_type === 'error') {
        return rejectWithValue(response.data.message);
      }
      return fulfillWithValue(response.data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Signup failed');
    }
  },
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
  "verifyOtp",
  async (
    {
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
      otp,
    }: {
      email: string;
      phone_number: number;
      first_name: string;
      last_name: string;
      address: string;
      zip_code: string | number;
      user_type: string;
      student_class: string | number;
      is_active: boolean;
      password: string;
      otp: string | number;
    },
    { fulfillWithValue, rejectWithValue }
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
        otp,
      };

      const response = await api.post(endpoints.VERIFY_OTP, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("response.data ==>", response.data);

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log("API error:", error.response?.data || error.message);

      // forward backend error to Redux
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const sendOtpPassword = createAsyncThunk(
  'sendOtpPassword',
  async ({ user }: { user: string }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const data = { user };

      const response = await api.post(endpoints.FORGOT_PASSWORD, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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

export const reSendOtp = createAsyncThunk(
  'reSendOtp',
  async (
    { phone_number }: { phone_number: string },
    { fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const data = { phone_number };

      const response = await api.post(endpoints.RESEND_OTP, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
      otp,
    }: {
      email: string | undefined;
      new_password: string;
      confirm_new_password: string;
      otp: string;
    },
    { fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const data = { email, otp, new_password, confirm_new_password };

      const response = await api.put(endpoints.FORGOT_PASSWORD, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log('Reset API Error:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: 'Reset failed' },
      );
    }
  },
);

export const CreateOrder = createAsyncThunk(
  'CreateOrder',
  async (
    { student_class, price }: { student_class: string; price: string },
    {getState, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const state: any = getState(); 
      const token = state.auth?.token;
        console.log("token:==",token)
      const data = { student_class, price };
      const response = await api.post(endpoints.CREATE_ORDER, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
           Authorization: token ? `Bearer ${token}`:""
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

export const paymentVerify = createAsyncThunk(
  'paymentVerify',
  async (
    {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    },
    {getState, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const state: any = getState(); 
      const token = state.auth?.token;
      const data = {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      };

      const response = await api.post(endpoints.VERIFY_PAYMENT, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}`:""
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

export const AuthSlice = createSlice({
  name: 'authlice',
  initialState,
  reducers: {
    restoreUserSession: (state, action) => {
      state.token = action.payload.token;
    },
    actionLogout: state => {
      state.token = null;
    },
    logout: state => {
      state.accessToken = null;
      state.refreshToken = null;
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
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
      console.log(action.payload, 'action......==[ppS');
      state.message = action.payload?.message;
      state.token = action.payload?.access;

      state.refreshToken = action.payload?.refresh;

      // Persist tokens
      if (action.payload.access && action.payload.refresh) {
        AsyncStorage.setItem('accessToken', action.payload.access);
        AsyncStorage.setItem('refreshToken', action.payload.refresh);
      }
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading = false;
      state.message = 'Please try again!';
      state.errorMsg =
        typeof action.payload === 'string'
          ? action.payload
          : JSON.stringify(action.payload);
    });
    builder.addCase(signUpAction.pending, state => {
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
      state.error = action.payload?.message || 'Signup failed';
      state.message = action.payload as string;
    });
    builder.addCase(getClassNames.pending, state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });
    builder.addCase(getClassNames.fulfilled, (state, action) => {
      state.loading = false;
      state.getClassData = Array.isArray(action.payload?.data)
        ? action.payload?.data
        : [];
      //state.getClassData = action.payload.data;
    //  console.log(state.getClassData, '==============getclass=============');
      state.message = action.payload.message;
    });
    builder.addCase(getClassNames.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload?.message || 'Signup failed';
      state.message = action.payload as string;
    });
    builder.addCase(resetPassword.pending, state => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(verifyOtp.pending, state => {
      state.loading = true;
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      state.loading = false;
       state.message = action.payload as string;
       state.token = action.payload?.data?.access || null
       state.refreshToken = action.payload?.data?.refresh
       state.checkPayment = action.payload?.data?.is_paid
       if(action.payload.message_type == 'success'){
             AsyncStorage.setItem("access_token",action.payload?.data?.access)
       }
    });
builder.addCase(verifyOtp.rejected, (state, action) => {
  console.log("rejected payload:", action.payload);
  state.loading = false;
  state.message =
    (action.payload as any)?.message ||
    action.error?.message ||
    "OTP verification failed";
});

    builder.addCase(sendOtpPassword.pending, state => {
      state.loading = true;
    });
    builder.addCase(sendOtpPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.statusCode = action.payload.statusCode;
    });
    builder.addCase(sendOtpPassword.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(CreateOrder.pending, state => {
      state.loading = true;
    });
    builder.addCase(CreateOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.orderId = action.payload.data.id;
      //console.log(state.orderId, '=====payorderid=====');
    });
    builder.addCase(CreateOrder.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(paymentVerify.pending, state => {
      state.loading = true;
    });
    builder.addCase(paymentVerify.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(paymentVerify.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
    builder.addCase(reSendOtp.pending, state => {
      state.loading = true;
    });
    builder.addCase(reSendOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.statusCode = action.payload.statusCode;
    });
    builder.addCase(reSendOtp.rejected, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    });
  },
});

export const { actionLogout, restoreUserSession } = AuthSlice.actions;

export default AuthSlice.reducer;
