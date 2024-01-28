import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { createAsyncThunk } from "@reduxjs/toolkit";

//thunk functions for firestore operations
export const getTotalIncome = createAsyncThunk(
  "statistics/getTotalIncome",
  async (uid) => {
    try {
      const ref = collection(db, "income");
      const q = query(ref, where("uid", "==", uid));
      let totalIncome = 0;

      const querySnapshot = await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          totalIncome += parseInt(doc.data().amount);
        });
      });
      return totalIncome;
    } catch (e) {
      console.error("Error Calculating Income: ", e);
    }
  }
);

export const getTotalExpenses = createAsyncThunk(
  "statistics/getTotalExpense",
  async (uid) => {
    try {
      const ref = collection(db, "expenses");
      const q = query(ref, where("uid", "==", uid));
      let totalExpenses = 0;

      const querySnapshot = await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          totalExpenses += parseInt(doc.data().amount);
        });
      });

      return totalExpenses;
    } catch (e) {
      console.error("Error Calculating Income: ", e);
    }
  }
);

export const getTotalSavings = createAsyncThunk(
  "statistics/getTotalSavings",
  async (uid) => {
    try {
      const ref = collection(db, "savings ");
      const q = query(ref, where("uid", "==", uid));
      let totalSavings = 0;

      const querySnapshot = await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          totalSavings += parseInt(doc.data().amount);
        });
      });
      return totalSavings;
    } catch (e) {
      console.error("Error Calculating Income: ", e);
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
  },
  extraReducers: (builder) => {
    builder.addCase(getTotalIncome.fulfilled, (state, action) => {
      state.totalIncome = action.payload;
    });
    builder.addCase(getTotalExpenses.fulfilled, (state, action) => {
      state.totalExpenses = action.payload;
    });
    builder.addCase(getTotalSavings.fulfilled, (state, action) => {
      state.totalSavings = action.payload;
    });
  },
});

export const statisticsActions = statisticsSlice.actions;
export default statisticsSlice;
