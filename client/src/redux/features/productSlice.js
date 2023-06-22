import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";

//get all products
export const getAllProducts = createAsyncThunk(
  "/product/getProducts",
  async ({ keyword, category, currentPage }, { rejectWithValue }) => {
    try {
      const response = await api.allProducts(keyword, category, currentPage);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "/product/getSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.singleProduct(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReview = createAsyncThunk(
  "/product/add/review",
  async (data, { dispatch, rejectWithValue }) => {
    const { rating, comment, productId, toast } = data;
    try {
      const response = await api.addReview({ rating, comment, productId });
      toast.success(response.data.message || "Review added successfully!");
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

//getAllReviews
export const allReviews = createAsyncThunk(
  "/product/all/review",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.getReviews(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//delete Review
export const ReviewDelete = createAsyncThunk(
  "/review/delete/admin",
  async ({ reviewId, productId, toast }, { rejectWithValue }) => {
    try {
      const response = await api.deleteReview(reviewId, productId);
      toast.success(response.data.message || "Review delete successFully!");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    resultPerPage: null,
    productsCount: null,
    review: null,
    reviews: [],
    product: {},
    products: [],
    loading: false,
    message: "",
    error: "",
    reviewError: "",
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReviewError: (state) => {
      state.reviewError = null;
    },
  },

  extraReducers: {
    [getAllProducts.pending]: (state) => {
      state.loading = true;
    },
    [getAllProducts.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.resultPerPage = action.payload.resultPerPage;
      state.productsCount = action.payload.productsCount;
    },
    [getAllProducts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
    [getSingleProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [getSingleProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.product = action.payload.data;
    },
    [getSingleProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },

    [createReview.pending]: (state, action) => {
      state.loading = true;
    },
    [createReview.fulfilled]: (state, action) => {
      state.loading = false;
      state.review = action.payload;
    },
    [createReview.rejected]: (state, action) => {
      state.loading = false;
      state.reviewError = action.payload?.message;
    },
    [allReviews.pending]: (state, action) => {
      state.loading = true;
    },
    [allReviews.fulfilled]: (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
    },
    [allReviews.rejected]: (state, action) => {
      state.loading = false;
      state.reviewError = action.payload.message;
    },
    [ReviewDelete.pending]: (state) => {
      state.loading = true;
    },
    [ReviewDelete.fulfilled]: (state, action) => {
      state.loading = false;
      const { reviewId, productId } = action.payload;
      if (reviewId && productId) {
        state.reviews = state.reviews.filter(
          (item) => item._id !== reviewId || item.productId !== productId
        );
      }
    },
    [ReviewDelete.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    },
  },
});

export const { clearError, clearReviewError } = productSlice.actions;
export default productSlice.reducer;
