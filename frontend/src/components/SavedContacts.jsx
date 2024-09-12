import React from 'react'
import { useSelector } from 'react-redux'
import ContactCard from './ContactCard'

const SavedContacts = () => {

    const favouriteContactsList = useSelector((state) => state.contacts.savedContacts);
    console.log(favouriteContactsList);

    return (
        <>
            <h2 className='favourite-heading'>Your Favourite Contacts List</h2>
            <div className="contactscontainer">
                <ul>
                    {favouriteContactsList.length > 0 ? favouriteContactsList.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    )) : (
                        <p>No contacts available</p>
                    )}
                </ul>
            </div>
        </>
    )
}

export default SavedContacts