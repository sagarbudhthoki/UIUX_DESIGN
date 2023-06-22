import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

//register
export const register = createAsyncThunk(
  "/auth/register",
  async ({ myForm, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.userRegister(myForm);
      toast.success(response.data.message || "register successfully!");
      navigate("/verify/otp");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//login
export const login = createAsyncThunk(
  "/auth/login",
  async ({ loginValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.userLogin(loginValue);
      toast.success(response.data?.message || "login successfully!");
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
        return response.data;
      } else {
        navigate("/profile");
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//verify account
export const accountVerify = createAsyncThunk(
  "/auth/verifyOtp",
  async ({ otpValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.verifyOtp(otpValue);
      toast.success(response.data.message || "account verify successfully!");
      navigate("/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//forget password
export const passwordForgot = createAsyncThunk(
  "/auth/forget/password",
  async ({ forgotValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.forgotPassword(forgotValue);
      toast.success(response.data.message || "otp sent to your email!");
      navigate("/reset/password");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//reset password
export const passwordReset = createAsyncThunk(
  "/auth/reset/password",
  async ({ resetValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.resetPassword(resetValue);
      toast.success(response.data.message || "password changed successfully!");
      navigate("/login");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//me
export const profile = createAsyncThunk(
  "/auth/me",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.myProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update profile
export const profileUpdate = createAsyncThunk(
  "/auth/update/profile",
  async ({ updateForm, navigate, toast }, { rejectWithValue }) => {
    // pass dispatch as an argument
    try {
      const response = await api.updateProfile(updateForm);
      toast.success(response.data.message || "profile update success!");
      navigate("/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// changePassword
export const changePassword = createAsyncThunk(
  "/auth/update/Password",
  async ({ passwordValue, navigate, toast }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.updatePassword(passwordValue);
      toast.success(response.data.message || "password change successfully!");
      dispatch(setLogout()); // dispatch setLogout action upon successful password change
      navigate("/login"); // redirect to login page
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//all users by admin
export const allUsers = createAsyncThunk(
  "/auth/allUsers",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.allAdminUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
    isAdmin: false,
    singleUser: null,
    users: [],
    loading: false,
    message: "",
    error: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.clear();
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [accountVerify.pending]: (state) => {
      state.loading = true;
    },
    [accountVerify.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [accountVerify.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [passwordForgot.pending]: (state) => {
      state.loading = true;
    },
    [passwordForgot.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [passwordForgot.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [passwordReset.pending]: (state) => {
      state.loading = true;
    },
    [passwordReset.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [passwordReset.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      state.isAdmin = true;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [profile.pending]: (state) => {
      state.loading = true;
    },
    [profile.fulfilled]: (state, action) => {
      state.loading = false;
      state.singleUser = action.payload.data;
    },
    [profile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [profileUpdate.pending]: (state) => {
      state.loading = true;
    },
    [profileUpdate.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...state.user, token: state.user?.token })
      );
    },
    [profileUpdate.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [changePassword.pending]: (state) => {
      state.loading = true;
    },
    [changePassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [changePassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [allUsers.pending]: (state) => {
      state.loading = true;
    },
    [allUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload.data;
    },
    [allUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { clearError, setUser, setLogout } = authSlice.actions;
export default authSlice.reducer;
