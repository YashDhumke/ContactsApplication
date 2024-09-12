import React from 'react';
import '../src/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from './components/ContactList';
import UserForm from './components/UserForm';
import SavedContacts from './components/SavedContacts';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/add" element={<UserForm />} />
          <Route path="/edit/:id" element={<UserForm />} />
          <Route path='/favourites' element={<SavedContacts />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
