import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { auth , googleProvider} from "../firebase/firebase";
import { signOut } from "firebase/auth";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const signInWithCredientials = createAsyncThunk("auth/signInWithCredientials", 
  async (email , password) => {
    try {
      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
            return userCredential.user
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
)

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((userCredential) => {
          return userCredential.user
      });
    } catch (err) {
      console.error(err);
    }
  }
);

export const signOutFrom = createAsyncThunk("auth/signOut", 
  async () => {
    try {
      await signOut(auth).then((res) => {
        return null
      });
    } catch (err) {
      console.error(err);
    }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isLoading: true,
    isAuthenticated: false
  },
  reducers: {
    signIn(state, action) {
      console.log("In Sign in Reducer")
      state.user = action.payload
      state.isLoading = false
      state.isAuthenticated = true
    },
    signOut(state,action) {
      console.log("In Sign out Reducer");
      state.user = null
      state.isLoading = true
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signInWithCredientials.fulfilled , (state , action) => {
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(signInWithGoogle.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(signOutFrom.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = false;
    });

  }
});

export const authActions = authSlice.actions;

export default authSlice

