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
import { db } from "./firebase";

export async function getIncomes(uid, setIncomes, setIsIncomeLoaded) {
  const incomesRef = collection(db, "income");
  const incomeQuery = query(incomesRef, where("uid", "==", uid));

  const querySnapshot = await getDocs(incomeQuery).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      key: doc.id,
    }));
    setIncomes(newData);
    setIsIncomeLoaded(false);
    console.log(newData);
  });
}

export async function addIncome(uid, name, type, amount, date, description) {
  try {
    const docRef = await addDoc(collection(db, "income"), {
      uid: uid,
      name: name,
      type: type,
      amount: amount,
      date: date,
      description: description,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function deleteIncome(docId) {
  try {
    deleteDoc(doc(db, "income", docId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

export async function updateIncome(
  docId,
  name,
  type,
  amount,
  date,
  description
) {
  updateDoc(doc(db, "income", docId), {
    name,
    type,
    amount,
    date,
    description,
  });

  console.log("Income updated successfully");
}

export async function getExpenses(uid, setExpenses, setIsExpensesLoaded) {
  const expensesRef = collection(db, "expenses");
  const expensesQuery = query(expensesRef, where("uid", "==", uid));

  const querySnapshot = await getDocs(expensesQuery).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      key: doc.id,
    }));
    setExpenses(newData);
    setIsExpensesLoaded(false);
    console.log(newData);
  });
}

export async function addExpenses(uid, name, type, amount, date, description) {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      uid: uid,
      name: name,
      type: type,
      amount: amount,
      date: date,
      description: description,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function updateExpenses(
  docId,
  name,
  type,
  amount,
  date,
  description
) {
  try {
    updateDoc(doc(db, "expenses", docId), {
      name,
      type,
      amount,
      date,
      description,
    });

    console.log("Expenses updated successfully");
  } catch (e) {
    console.log("Expenses updated failed");
  }
}

export async function deleteExpenses(docId) {
  try {
    deleteDoc(doc(db, "expenses", docId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

export async function getSavings(uid, setSavings, setIsSavingsLoaded) {
  const ref = collection(db, "savings ");
  const q = query(ref, where("uid", "==", uid));

  const querySnapshot = await getDocs(q).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      key: doc.id,
    }));
    setSavings(newData);
    setIsSavingsLoaded(false);
    console.log(newData);
  });
}

export async function addSavings(uid, source, amount, deadline, description) {
  try {
    const docRef = await addDoc(collection(db, "savings "), {
      uid: uid,
      source: source,
      amount: amount,
      deadline: deadline,
      description: description,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function updateSavings(
  docId,
  source,
  amount,
  deadline,
  description
) {
  try {
    updateDoc(doc(db, "savings ", docId), {
      source,
      amount,
      deadline,
      description,
    });

    console.log("Savings updated successfully");
  } catch (e) {
    console.log("Savings updated failed");
  }
}

export async function deleteSavings(docId) {
  try {
    deleteDoc(doc(db, "savings ", docId));
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}

//statistics 
export async function getTotalIncome(uid, setTotalIncome) {
  //51YpMR8G2tcYTXCY8caWnFcGEhz1
  const ref = collection(db, "income");
  const q = query(ref, where("uid", "==", uid));
  let totalIncome = 0;

  const querySnapshot = await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      totalIncome += parseInt(doc.data().amount);
    });
  });

  setTotalIncome(totalIncome)
  console.log("Total income is: " , totalIncome)
}

export async function getTotalExpenses(uid, setTotalExpenses) {
  //51YpMR8G2tcYTXCY8caWnFcGEhz1
  const ref = collection(db, "expenses");
  const q = query(ref, where("uid", "==", uid));
  let totalExpenses = 0;

  const querySnapshot = await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      totalExpenses += parseInt(doc.data().amount);
    });
  });

  setTotalExpenses(totalExpenses);
  console.log("Total expenses is: ", totalExpenses);
}

export async function getTotalSavings(uid, setTotalSavings) {
  //51YpMR8G2tcYTXCY8caWnFcGEhz1
  const ref = collection(db, "savings ");
  const q = query(ref, where("uid", "==", uid));
  let totalSavings = 0;

  const querySnapshot = await getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      totalSavings += parseInt(doc.data().amount);
    });
  });

  setTotalSavings(totalSavings);
  console.log("Total Savings is: ", totalSavings);
}

