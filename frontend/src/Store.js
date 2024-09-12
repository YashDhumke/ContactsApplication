import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './Features/contacts/contactsSlice';


// Creating the store for our application 
const store = configureStore({
    reducer: {
        contacts: contactsReducer,
    },
});

export default store;