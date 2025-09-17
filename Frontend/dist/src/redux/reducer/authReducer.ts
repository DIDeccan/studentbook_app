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
      class_id,
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
      class_id: string | number;
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
        class_id,
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

      //console.log("response.data ==>", response.data);

      return fulfillWithValue(response.data);
    } catch (error: any) {
     // console.log("API error:", error.response?.data || error.message);

      // forward backend error to Redux
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const sendOtpPassword = createAsyncThunk(
  "sendOtpPassword",
  async ({ user }: { user: string }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await api.post(endpoints.FORGOT_PASSWORD, { user });

      // check message_type instead of status_type
      if (response.data.message_type === "success") {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const verifyOtp1 = createAsyncThunk(
  "verifyOtp1",
  async (
    { user, otp }: { user: string; otp: string },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        endpoints.FORGOT_PASSWORD, // same endpoint you tested in Postman
        { user, otp }, // payload
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log("Verify OTP Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "OTP verification failed" }
      );
    }
  }
);

// export const sendOtpPassword = createAsyncThunk(
//   'sendOtpPassword',
//   async ({ user }: { user: string }, { fulfillWithValue, rejectWithValue }) => {
//     try {
//       const data = { user };

//       const response = await api.post(endpoints.FORGOT_PASSWORD, data, {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       });

//       if (response) {
//         return fulfillWithValue(response.data);
//       } else {
//         return rejectWithValue('Something went wrong');
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
// );

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
  "resetPassword",
  async (
    {
      user,
      otp,
      new_password,
      confirm_new_password,
    }: {
      user?: string;
      otp?: string;
      new_password?: string;
      confirm_new_password?: string;
    },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const data: any = {};
      if (user) data.user = user;
      if (otp) data.otp = otp;
      if (new_password) data.new_password = new_password;
      if (confirm_new_password) data.confirm_new_password = confirm_new_password;

      const response = await api.put(endpoints.FORGOT_PASSWORD, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return fulfillWithValue(response.data);
    } catch (error: any) {
      console.log("Reset API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: "Reset failed" }
      );
    }
  }
);

export const CreateOrder = createAsyncThunk(
  'CreateOrder',
  async (
    { class_id, price }: { class_id: string; price: string },
    { getState, fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")
     
      const data = {class_id, price };

      const response = await api.post(endpoints.CREATE_ORDER, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (response?.data) {
        console.log('Order created:', response.data);
        return fulfillWithValue(response.data);
      } else {
        console.log('Empty response');
        return rejectWithValue('Something went wrong');
      }
    } catch (error: any) {
      if (error.response) {
        console.error('API Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
        return rejectWithValue('No response from server');
      } else {
        console.error('Unexpected Error:', error.message);
        return rejectWithValue(error.message);
      }
    }
  }
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
    { getState, fulfillWithValue, rejectWithValue }
  ) => {
    try {
     const state: any = getState();
     const storedToken = await AsyncStorage.getItem('access_token')
      const rawToken = state.auth?.token || storedToken
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "")

      const data = {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      };

      const response = await api.post(endpoints.VERIFY_PAYMENT, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (response?.data) {
        console.log("✅ Payment Verify Success:", response.data);
        return fulfillWithValue(response.data);
      } else {
        console.error("Empty verify response");
        return rejectWithValue('Something went wrong');
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Payment Verify API Error:", error.response.data);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        return rejectWithValue('No response from server');
      } else {
        console.error("Unexpected Error:", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logoutAction = createAsyncThunk(
  "logoutAction",
  async (
    { refresh }: { refresh: string | null },
    { getState, fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const storedToken = await AsyncStorage.getItem("access_token");
      const rawToken = state.auth?.token || storedToken;
      const token = rawToken?.replace(/^['"]+|['"]+$/g, "");

      const response = await api.post(
        endpoints.LOGOUT, // e.g., "/auth/logout/"
        { refresh }, // payload
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
            validateStatus: (status) => {
      return (status >= 200 && status < 300) || status === 205;
    },
  }  
      );

      if ( response.data) {
        console.log("Logout success:", response.data);

        // Clear AsyncStorage after logout
        await AsyncStorage.multiRemove(["access_token", "refresh_token"]);

        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue("Logout failed: Empty response");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        return rejectWithValue("No response from server");
      } else {
        console.error("Unexpected Error:", error.message);
        return rejectWithValue(error.message);
      }
    }
  }
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
    logoutActionReducer: state => {
        state.token = null;
      state.accessToken = null;
      state.refreshToken = null;
      AsyncStorage.removeItem('access_token');
      AsyncStorage.removeItem('refresh_token');
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
    builder.addCase(logoutAction.pending, (state) => {
        state.loading = true;
      })
       builder.addCase(logoutAction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
        state.message = action.payload.message;
        state.message_type = action.payload.message_type; // "success"
      })
       builder.addCase(logoutAction.rejected, (state, action: any) => {
        state.loading = false;
        state.message = action.payload?.message || "Logout failed";
        state.message_type = "error";
      });

       builder.addCase(verifyOtp1.pending, state => {
      state.loading = true;
    });
    builder.addCase(verifyOtp1.fulfilled, (state, action) => {
      state.loading = false;
       state.message = action.payload as string;
    });
builder.addCase(verifyOtp1.rejected, (state, action) => {
  console.log("rejected payload:", action.payload);
  state.loading = false;
  state.message =
    (action.payload as any)?.message ||
    action.error?.message ||
    "OTP verification failed";
});
  },
});

export const { actionLogout, restoreUserSession,logoutActionReducer} = AuthSlice.actions;

export default AuthSlice.reducer;
