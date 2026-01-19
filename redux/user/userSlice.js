import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { auth } from "../../firebase/firebase.utils"; // Adjust path to your config

// === 1. THUNK: REGISTER USER ===
export const registerUser = createAsyncThunk(
  "user/register",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      // Firebase Logic
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Name
      await updateProfile(auth.currentUser, { displayName: name });
      
      // Return Serializable Data (Redux can't store complex Firebase objects)
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// === 2. THUNK: LOGIN USER ===
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      };
    } catch (error) {
      // Simplify Firebase errors for the UI
      let msg = "Login failed";
      if(error.code.includes('user-not-found')) msg = "User not found";
      if(error.code.includes('wrong-password')) msg = "Wrong password";
      return rejectWithValue(msg);
    }
  }
);

// === 3. THUNK: LOGOUT USER ===
export const logoutUser = createAsyncThunk(
  "user/logout",
  async () => {
    await signOut(auth);
  }
);

// === THE SLICE ===
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    // This is for the "onAuthStateChanged" listener in App.jsx
    setUserFromSession: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
    }
  },
  // Handle the Thunks automatically
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { setUserFromSession } = userSlice.actions;
export const selectUser = (state) => state.user.userInfo;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;