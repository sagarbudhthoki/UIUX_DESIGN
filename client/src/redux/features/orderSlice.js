import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

//create order
export const addOrder = createAsyncThunk(
  "/order/add",
  async ({ order, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.createOrder(order);
      toast.success(response.data.message || "order success");
      navigate("/success");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//all orders
export const getAllOrders = createAsyncThunk(
  "/order/adminOrders",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.getAllOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//payment stripe get key
export const getStripe = createAsyncThunk(
  "/payment/getStripe",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.getStripeKey();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//add payment
export const PaymentAdd = createAsyncThunk(
  "/add/payment/shop",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.addPayment(paymentData);
      const client_secret = response.data.client_secret;

      return { client_secret };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//get all orders
export const allOrders = createAsyncThunk(
  "/all/myOrders",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.getOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//single order
export const OrderSingleDetail = createAsyncThunk(
  "/order/single/detail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.singleOrder(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete Order by admin
export const deleteOrder = createAsyncThunk(
  "/order/delete/admin",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteOrder(id);
      toast.success(response.data.message || "Order delete successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//updateOrder
export const orderUpdateProcess = createAsyncThunk(
  "/order/update/admin",
  async ({ id, status, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateProcessOrder(id, status);
      toast.success(response.data.message || "Status update successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    isLoading: false,
    payment: null,
    order: {},
    orders: [],
    // myOrder: null,
    // myOrders: [],
    stripeKey: "",
    message: "",
    error: "",
  },

  reducers: {
    clearError: (state, action) => {
      state.error = null;
    },
    clearOrder: (state, action) => {
      state.order = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(PaymentAdd.pending, (state) => {
        state.loading = true;
      })
      .addCase(PaymentAdd.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(PaymentAdd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(getStripe.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getStripe.fulfilled, (state, action) => {
        state.loading = false;
        state.stripeKey = action.payload.stripeApiKey;
      })
      .addCase(getStripe.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(allOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(allOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
      })
      .addCase(allOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(OrderSingleDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(OrderSingleDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.data;
      })
      .addCase(OrderSingleDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;

        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.orders = state.orders.filter((item) => item._id !== id);
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(orderUpdateProcess.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(orderUpdateProcess.fulfilled, (state, action) => {
        state.isLoading = false;
        const {
          arg: { id },
        } = action.meta;
        if (id) {
          state.orders = state.orders.map((item) =>
            item._id === id ? action.payload : item
          );
        }
      })
      .addCase(orderUpdateProcess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
