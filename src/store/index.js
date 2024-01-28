import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import expensesSlice from './expensesSlice';
import savingsSlice from './savingsSlice';
import incomeSlice from './incomeSlice';
import statisticsSlice from './statisticsSlice';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        expenses: expensesSlice.reducer,
        savings: savingsSlice.reducer,
        incomes: incomeSlice.reducer,
        statistics: statisticsSlice.reducer
    }
})

export default store;