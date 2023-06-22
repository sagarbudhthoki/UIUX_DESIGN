import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

//create PRoduct
export const createProduct = createAsyncThunk(
  "/admin/add/product",
  async ({ myForm, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.addProduct(myForm);
      toast.success(response.data.message || "Product create successfully!");
      navigate("/admin/dashboard/product-list");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update product
export const updateProduct = createAsyncThunk(
  "/admin/edit/product",
  async ({ myForm, id, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.editProduct(myForm, id);
      toast.success(response.data.message || "Product update successfully!");
      navigate("/admin/dashboard/product-list");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get all products by admin
export const getAllProductsByAdmin = createAsyncThunk(
  "/admin/product/getByAdmin",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.allProductsAdmin();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//get all users by Admin
export const getAllUsersByAdmin = createAsyncThunk(
  "/admin/customers",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.allCustomers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//get single user by admin
export const getSingleUserAdmin = createAsyncThunk(
  "/admin/singleUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.singleUser(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update role by admin
export const UpdateRoleAdmin = createAsyncThunk(
  "/admin/roleUpdate",
  async ({ formData, id, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await api.updateRole(formData, id);
      toast.success(response.data.message || "Role update success!");
      navigate("/admin/dashboard/customer-list");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete role by admin
export const RoleDeleteByAdmin = createAsyncThunk(
  "/admin/deleteRole",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteRole(id);
      toast.success(response.data.message || "role delete successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//get single product
export const singleAdminProduct = createAsyncThunk(
  "/admin/product/admin/single/product",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.adminSingle(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete product by admin
export const productDelete = createAsyncThunk(
  "/admin/product/delete",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteProduct(id);
      toast.success(response.data.message || "product delete successfully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    single: {},
    adminProducts: [],
    customer: {},
    customers: [],
    loading: false,
    message: "",
    error: "",
  },
  reducers: {
    clearError: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: {
    [createProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    [createProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },

    [updateProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.adminProducts = state.adminProducts.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [updateProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [productDelete.pending]: (state, action) => {
      state.loading = true;
    },
    [productDelete.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.adminProducts = state.adminProducts.filter(
          (item) => item._id !== id
        );
      }
    },
    [productDelete.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getAllProductsByAdmin.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllProductsByAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.adminProducts = action.payload.data;
    },
    [getAllProductsByAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [singleAdminProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [singleAdminProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.single = action.payload.data;
    },
    [singleAdminProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getAllUsersByAdmin.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllUsersByAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.customers = action.payload.data;
    },
    [getAllUsersByAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getSingleUserAdmin.pending]: (state, action) => {
      state.loading = true;
    },
    [getSingleUserAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      state.customer = action.payload.data;
    },
    [getSingleUserAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [UpdateRoleAdmin.pending]: (state, action) => {
      state.loading = true;
    },
    [UpdateRoleAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.customers = state.customers.map((item) =>
          item._id === id ? action.payload : item
        );
      }
    },
    [UpdateRoleAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [RoleDeleteByAdmin.pending]: (state, action) => {
      state.loading = true;
    },
    [RoleDeleteByAdmin.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.customers = state.customers.filter((item) => item._id !== id);
      }
    },
    [RoleDeleteByAdmin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});
export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;
