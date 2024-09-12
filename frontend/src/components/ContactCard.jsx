import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { Pencil, Phone, Mail, Smartphone } from 'lucide-react';
import { fetchContacts } from '../Features/contacts/contactsSlice';
import { useDispatch, useSelector } from 'react-redux';

import swal from 'sweetalert'

const ContactCard = ({ contact, onDelete }) => {

  const { contacts = [], status, pageNumber, pageSize, totalPages, sortBy, sortOrder, searchQuery } = useSelector((state) => state.contacts);

  const dispatch = useDispatch();


  const handleDelete = (contactId) => {
    swal({
      title: "Are you sure?",
      text: "Are you sure that you want to Delete this contact?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
    })
      .then(willDelete => {
        if (willDelete) {
          onDelete(contactId);
          swal("Deleted!", "Your Contact has been deleted!", "success");
          dispatch(fetchContacts({ pageNumber, pageSize, sortBy, sortOrder, searchQuery }));
        } else {
          Navigate("/contacts")
        }
      });
  }

  return (
    <li>
      <div className="contactcard">
        <div className="upperpart">
          <div className="img">
            <img src={contact.photoUrl || 'https://i.pinimg.com/736x/a3/15/f2/a315f269bd8b394ee1166d9e71cbd2c6.jpg'} alt={contact.name} />
          </div>
          <div className="name">
            <h3>{contact.name}</h3>
          </div>
        </div>
        <div className="middlepart">
          <div className="element">
            <Phone size={20} />
            <p> Phone : {contact.mobile}</p>
          </div>
          <div className="element">
            <Smartphone size={20} />
            <p>Mobile : {contact.secondaryMobile}</p>
          </div>
          <div className="element">
            <Mail size={20} />
            <p> Mail : {contact.email}</p>
          </div>
        </div>
        <div className="lowerpart">
          <div className="cardbutton">
            <Link to={`/edit/${contact.id}`}><Pencil size={23} /></Link>
          </div>
          <div className=" delete">
            <Trash className='trash' color='red' size={23} onClick={() => handleDelete(contact.id)} />
          </div>

        </div>
      </div>
    </li>
  );
};

export default ContactCard;




