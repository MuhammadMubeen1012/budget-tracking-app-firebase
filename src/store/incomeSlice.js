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
export const addIncomeToDB = createAsyncThunk(
  "incomes/addIncomeToDB",
  async (income) => {
    try {
      const docRef = await addDoc(collection(db, "income"), income);
      console.log("Document written with ID: ", docRef.id);
      const newIncome = { id: docRef.id, income };
      return newIncome;
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
);

export const getIncomes = createAsyncThunk(
  "incomes/getIncomes",
  async (uid) => {
    const incomesRef = collection(db, "income");
    const incomesQuery = query(incomesRef, where("uid", "==", uid));
    console.log("Inside Income Thunk", uid);
    let newData = [];
    const querySnapshot = await getDocs(incomesQuery).then(
        (querySnapshot) => {
            newData = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            console.log("Income Data returned in thunk " ,newData);
        }
    );
    return newData;
  }
);


export const deleteIncome = createAsyncThunk(
  "incomes/deleteIncome",
  async (id) => {
    try {
      deleteDoc(doc(db, "income", id));
      return id;
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }
);

export const updateIncome = createAsyncThunk(
  "incomes/updateIncome",
  async (income) => {
    try {
      updateDoc(doc(db, "income", income.id), income);
      console.log("Incomes updated successfully");
      return income;
    } catch (e) {
      console.log("Incomes updated failed");
    }
  }
);

const incomesSlice = createSlice({
  name: "incomes",
  initialState: {
    incomesList: [],
    changed: false,
  },
  extraReducers: (builder) => {
    builder.addCase(addIncomeToDB.fulfilled, (state, action) => {
      state.incomesList.push(action.payload);
    })
    builder.addCase(getIncomes.fulfilled, (state, action) => {
      console.log("Income Payload returned " , action.payload);
      state.incomesList = action.payload;
      console.log("Inside Income Slice" , state.incomesList)
    })
    builder.addCase(deleteIncome.fulfilled, (state, action) => {
      state.incomesList = state.incomesList.filter(
        (income) => income.id !== action.payload
      );
    })
    builder.addCase(updateIncome.fulfilled, (state, action) => {
      const id = action.payload.id;
      const income = {
        name: action.payload.name,
        amount: action.payload.amount,
        type: action.payload.type,
        description: action.payload.description,
      };
      const index = state.incomesList.findIndex((income) => income.id === id);
      if (index !== -1) {
        state.incomesList[index] = { id: id, income };
      }
    })
  },
});

export const incomesActions = incomesSlice.actions
export default incomesSlice;
