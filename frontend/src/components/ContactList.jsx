import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, deleteContact } from '../Features/contacts/contactsSlice';
import ContactCard from './ContactCard';
import { Link, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { ArrowDownNarrowWide, ArrowUpWideNarrow } from 'lucide-react';
import CustomPagination from './CustomPagination';
import { setPageNumber } from '../Features/contacts/contactsSlice';
import { setSortBy, setSortOrder, setSearchQuery } from '../Features/contacts/contactsSlice';


const ContactList = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts = [], status, pageNumber, pageSize, totalPages, sortBy, sortOrder, searchQuery } = useSelector((state) => state.contacts);
  console.log(searchQuery)

  useEffect(() => {
    dispatch(fetchContacts({ pageNumber, pageSize, sortBy, sortOrder, searchQuery }));
  }, [dispatch, pageNumber, pageSize, sortBy, sortOrder, searchQuery]);

  const handleDelete = (id) => {
    dispatch(deleteContact(id));
  };

  const handleAddContact = () => {
    navigate('/add'); // Navigate to the contact creation form
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    dispatch(setSearchQuery(e.target.value));
    dispatch(fetchContacts({ pageNumber, pageSize, sortBy, sortOrder, searchQuery }));
  };

  const handleSortChange = (e) => {

    const value = e.target.value;
    const [field, order] = value.split(':');
    dispatch(setSortBy(field));
    dispatch(setSortOrder(order || 'asc')); // Default to ascending if no order is provided
    dispatch(fetchContacts({ pageNumber, pageSize, sortBy: field, sortOrder: order || 'asc', searchQuery }));
  };

  const handlePageChange = async (value) => {
    console.log(value)
    dispatch(setPageNumber(value));
    const data = await dispatch(fetchContacts({ pageNumber, pageSize, sortBy, sortOrder }));
    console.log(data);

  };



  return (
    <>
      <div className="navbar">
        <h2>Contact List</h2>
        <button onClick={handleAddContact}>Add New Contact</button>

      </div>
      <div className="searching-sorting">

        <div className="sorting">
          <select id="sortby" value={`${sortBy}:${sortOrder}`} onChange={(e) => { handleSortChange(e) }}>
            <option value="name:asc">Name (Ascending)</option>
            <option value="name:desc">Name (Descending)</option>
            <option value="mobile:asc">Mobile (Ascending)</option>
            <option value="mobile:desc">Mobile (Descending)</option>
          </select>
        </div>
        <div className="searchbar">
          <input
            type="text"
            placeholder='Search Contact'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {/* <div className="sorting" onClick={() => { handleSortChange('name') }}>
          {sortOrder === 'asc' && sortBy === "name" ? <ArrowUpWideNarrow /> : <ArrowDownNarrowWide />}
         
          <p>Name</p>
        </div> */}
      </div>
      <div className="contactscontainer">
        {status === 'loading' && <p>Loading the contacts</p>}
        {status === 'failed' && <p>Failed to load contacts</p>}
        <ul>
          {contacts.length > 0 ? contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onDelete={handleDelete} />
          )) : (
            status !== 'loading' && <p>No contacts available</p>
          )}
        </ul>
        <div className="pagination">
          <CustomPagination
            totalPages={totalPages}
            currentPage={pageNumber}
            handlePageChange={handlePageChange}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
};

export default ContactList;


