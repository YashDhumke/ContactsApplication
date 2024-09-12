import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, updateContact } from '../Features/contacts/contactsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import useFormValidation from '../Utils/useFormValidation';
import swal from 'sweetalert'


const UserForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contacts = useSelector((state) => state.contacts.contacts);
  const contact = contacts.find((c) => c.id === parseInt(id));

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    secondaryMobile: '',
    email: '',
    photoUrl: '',
  });

  const { errors, validate } = useFormValidation(contacts, id);

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact, updateContact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(formData)) {
      if (!id) {
        dispatch(addContact(formData));
        swal("Your contact is added successfully");
      } else {
        dispatch(updateContact({ ...formData, id }));
        swal("Your contact is updated successfully");
      }
      navigate('/');
    }
  };

  return (
    <>
      <div className="title">
        <h2>{id ? 'Edit Contact' : 'Add Contact'}</h2>
      </div>
      <div className="userform">
        <form onSubmit={handleSubmit}>
          <div className='element'>
            <label>Name: <span className='star'>*</span></label>
            {errors.name && <p className="error">{errors.name}</p>}
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className='element'>
            <label>Mobile: <span className='star'>*</span></label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
            {errors.mobile && <p className="error">{errors.mobile}</p>}
          </div>
          <div className='element'>
            <label>Secondary Mobile:</label>
            <input type="text" name="secondaryMobile" value={formData.secondaryMobile} onChange={handleChange} />
          </div>
          <div className='element'>
            <label>Email: <span className='star'>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div className='element'>
            <label>Photo URL:</label>
            <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} />
          </div>
          <button type="submit">{id ? 'Update' : 'Add'} Contact</button>
        </form>
      </div>
    </>
  );
};

export default UserForm;
