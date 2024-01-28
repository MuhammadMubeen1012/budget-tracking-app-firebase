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
export const addExpensesToDB = createAsyncThunk(
  "expenses/addExpensesToDB",
  async (expense) => {
    try {
        const docRef = await addDoc(collection(db, "expenses"), expense);
        console.log("Document written with ID: ", docRef.id);
        const newExpense = {id: docRef.id , expense}
        return newExpense
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
);

export const getExpenses = createAsyncThunk(
    "expenses/getExpenses",
    async (uid) => {
        const expensesRef = collection(db, "expenses");
        const expensesQuery = query(expensesRef, where("uid", "==", uid));
        console.log("Inside Expense" , uid)
        let newData = []
        const querySnapshot = await getDocs(expensesQuery).then(
          (querySnapshot) => {
            newData = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
          }
        );
        return newData;
    }
)

export const deleteExpense = createAsyncThunk(
    "expenses/deleteExpense",
    async (id) => {
        try {
          deleteDoc(doc(db, "expenses", id));
          return id
        } catch (e) {
          console.error("Error deleting document: ", e);
        }
    }
)

export const updateExpense = createAsyncThunk(
    "expenses/updateExpense",
    async (expense) => {
        try {
          updateDoc(doc(db, "expenses", expense.id), expense);
          console.log("Expenses updated successfully");
          return expense
        } catch (e) {
          console.log("Expenses updated failed");
        }
    }
)

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    expenseList: [],
    changed: false
  },
  extraReducers: (builder) => {
    builder.addCase(addExpensesToDB.fulfilled , (state, action) => {
        state.expenseList.push(action.payload)
    })
    builder.addCase(getExpenses.fulfilled , (state, action) => {
        state.expenseList = action.payload
    })
    builder.addCase(deleteExpense.fulfilled , (state,action) => {
        state.expenseList = state.expenseList.filter((expense) => expense.id !== action.payload)
    })
    builder.addCase(updateExpense.fulfilled , (state , action) => {
        const id = action.payload.id;
        const expense = { name: action.payload.name , amount: action.payload.amount, type: action.payload.type, description: action.payload.description, date: action.payload.date};
        const index = state.expenseList.findIndex((expense) => expense.id === id);
        if (index !== -1) {
          state.expenseList[index] = { id: id, expense };
        }
    })
  }
});

export const expensesActions = expensesSlice.actions
export default expensesSlice