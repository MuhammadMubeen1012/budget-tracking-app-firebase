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
export const addSavingsToDB = createAsyncThunk(
  "savings/addSavingsToDB",
  async (saving) => {
    try {
      const docRef = await addDoc(collection(db, "savings "), saving);
      console.log("Document written with ID: ", docRef.id);
      const newSaving = { id: docRef.id, saving };
      return newSaving;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
);

export const getSavings = createAsyncThunk(
  "savings/getSavings",
  async (uid) => {
    const savingsRef = collection(db, "savings ");
    const savingsQuery = query(savingsRef, where("uid", "==", uid));

    let newData = [] 
    
    const querySnapshot = await getDocs(savingsQuery).then((querySnapshot) => {
      newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    });
      return newData;
  }
);

export const deleteSaving = createAsyncThunk(
  "savings/deleteSaving",
  async (id) => {
    try {
      deleteDoc(doc(db, "savings ", id));
      return id;
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }
);

export const updateSaving = createAsyncThunk(
  "savings/updateSaving",
  async (saving) => {
    try {
      updateDoc(doc(db, "savings ", saving.id), saving);
      console.log("Savings updated successfully");
      return saving;
    } catch (e) {
      console.log("Savings updated failed");
    }
  }
);

const savingsSlice = createSlice({
  name: "savings",
  initialState: {
    savings: [],
    changed: false,
  },
  extraReducers: (builder) => {
    builder.addCase(addSavingsToDB.fulfilled, (state, action) => {
      state.savings.push(action.payload);
    });
    builder.addCase(getSavings.fulfilled, (state, action) => {
      state.savings = action.payload;
    });
    builder.addCase(deleteSaving.fulfilled, (state, action) => {
      state.savings = state.savings.filter(
        (saving) => saving.id !== action.payload
      );
    });
    builder.addCase(updateSaving.fulfilled, (state, action) => {
      const id = action.payload.id;
      const saving = {
        source: action.payload.source,
        amount: action.payload.amount,
        deadline: action.payload.deadline,
        description: action.payload.description,
      };
      const index = state.savings.findIndex((saving) => saving.id === id);
      if (index !== -1) {
        state.savings[index] = { id: id, saving };
      }
    });
  },
});

export const savingsAction = savingsSlice.actions;
export default savingsSlice;
