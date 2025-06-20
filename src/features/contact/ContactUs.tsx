import { useState } from 'react';
import { useForm } from 'react-hook-form';

import NopApi from '../../app/api/ThemeContext/NopApi';

interface ContactFormInputs {
  FullName: string;
  Email: string;
  Enquiry: string;
}

const ContactUs = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormInputs>();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      const payload = {
        StoreId: 1,
        LanguageId: 1,
        ContactUsRequest: {
          ...data,
          SuccessfullySent: true,
          Result: "",
          DisplayCaptcha: true
        }
      };
      console.log('Payload:', payload);
      //await NopApi.Home.homePageProducts(RequestBody);
      const response = await NopApi.Account.ContactUs(payload);
      const resData = response;
      //console.log('Response:', resData);
      if (resData.SuccessfullySent) {
        setSuccessMessage(resData.Result);
        setErrorMessage('');
        reset();
      } else {
        setErrorMessage(resData.Result);
        setSuccessMessage('');
      }

    } catch (err) {
      setErrorMessage('Failed to send message. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2>Contact Us</h2>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Your name:</label>
          <input
            id="fullName"
            autoComplete="off"
            placeholder="Enter your name."
            className={`form-control ${errors.FullName ? 'is-invalid' : ''}`}
            {...register('FullName', { required: 'Enter your name' })}
          />
          {errors.FullName && <div className="invalid-feedback">{errors.FullName.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Your email:</label>
          <input
            id="email"
            autoComplete="off"
            placeholder="Enter your email address."
            type="email"
            className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
            {...register('Email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.Email && <div className="invalid-feedback">{errors.Email.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="enquiry" className="form-label">Enquiry:</label>
          <textarea
            id="enquiry"
            autoComplete="off"
            placeholder="Enter your enquiry."
            rows={4}
            className={`form-control ${errors.Enquiry ? 'is-invalid' : ''}`}
            {...register('Enquiry', { required: 'Enquiry is required' })}
          ></textarea>
          {errors.Enquiry && <div className="invalid-feedback">{errors.Enquiry.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
