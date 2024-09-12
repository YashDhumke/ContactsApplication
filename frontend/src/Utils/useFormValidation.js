import { useState } from 'react';

const useFormValidation = (contacts, id) => {
    const [errors, setErrors] = useState({
        name: '',
        mobile: '',
        email: '',
    });

    const validate = (formData) => {
        const newErrors = { name: '', mobile: '', email: '' };
        let isValid = true;

        // Check if name is provided
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }

        // mobile should be of 10 digits 
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required.';
            isValid = false;
        }
        else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be exactly 10 digits.';
            isValid = false;
        }

        // it must be a valid email 
        if (!formData.email.trim()) {
            newErrors.email = 'email is required.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address.';
            isValid = false;
        }

        // Checking for the duplicate email 
        if (contacts.some((contact) => contact.email === formData.email && contact.id !== id && !contact.id)) {
            newErrors.email = 'Email address already exists.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return { errors, validate };
};

export default useFormValidation;
