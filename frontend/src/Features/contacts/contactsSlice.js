import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// API endpoint
const API_URL = 'https://localhost:7206/api/Contacts';

// Thunk for feacthig out the contacts 
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async ({ pageNumber, pageSize, sortBy = "name", sortOrder = "asc", searchQuery = "" }) => {
  if (!searchQuery) {
    const response = await axios.get(`https://localhost:7206/api/Contacts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    return await response.data;
  }
  else {
    const response = await axios.get(`https://localhost:7206/api/Contacts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&searchQuery=${searchQuery}`);
    return await response.data;
  }
});

// thunk for adding the contact to the db 
export const addContact = createAsyncThunk('contacts/addContact', async (newContact) => {
  const response = await axios.post(API_URL, newContact);
  return response.data;
});

// thunk for  deleting contact
export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Update contact
export const updateContact = createAsyncThunk('contacts/updateContact', async (updatedContact) => {
  const response = await axios.put(`${API_URL}/${updatedContact.id}`, updatedContact);
  return response.data;
});

export const fetchTotalCount = createAsyncThunk('contacts/fetchTotalCount', async () => {
  try {
    const response = await axios.get('https://localhost:7206/getcount');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch total count');
  }
});



// Slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    savedContacts: [],
    status: 'idle',
    error: null,
    pageNumber: 1,
    pageSize: 4,
    totalPages: 0,
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: ""
  },
  reducers: {
    saveContact: (state, action) => {
      const contactExists = state.savedContacts.find(contact => contact.id === action.payload.id);
      if (!contactExists) {
        state.savedContacts.push(action.payload);
      }
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pageNumber = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {   // contacts/fetchContacts/pending
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {  // contacts/fetchContacts/fulfilled
        state.status = 'succeeded';
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {  //contacts/fetchContacts/fulfilled
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addContact.fulfilled, (state, action) => {
        state.contacts.push(action.payload);
      })
      .addCase(addContact.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
      })

      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index >= 0) {
          state.contacts[index] = action.payload;
        }
      })
  },
});
export default contactsSlice.reducer;
export const { saveContact, setPageNumber, setPageSize, setSortBy, setSortOrder, setTotalPages, setSearchQuery } = contactsSlice.actions;