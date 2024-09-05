import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCustomer from '../components/AddCustomer';
import { postCustomer } from '../store/apiFunctions';


describe('AddCustomer component renders', () => {
    it('renders the form elements correctly', () => {
        // Render the AddCustomer component
        render(<AddCustomer onCloseForm={() => {}} />);
        
        // Check if the phone input field is rendered
        const phoneInput = screen.getByRole('textbox', { name: /phone/i });
        expect(phoneInput).toBeInTheDocument();

        // Check if the name input field is rendered
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        expect(nameInput).toBeInTheDocument();

        // Check if the submit button is rendered
        const submitButton = screen.getByRole('button', { name: /add customer/i });
        expect(submitButton).toBeInTheDocument();
    });
});


describe('AddCustomer component runs', () => {
    it('should update phone state when valid numeric input is provided', () => {
        render(<AddCustomer onCloseForm={() => {}} />);
        
        // Find the phone input field
        const phoneInput = screen.getByRole('textbox', { name: /phone/i });
        
        // Simulate changing the input to a valid number
        fireEvent.change(phoneInput, { target: { value: '123456' } });
        
        // Assert that the value has been updated correctly
        expect(phoneInput.value).toBe('123456');

    });

    it('should show error message when non-numeric input is provided', () => {
        render(<AddCustomer onCloseForm={() => {}} />);
        // Find the phone input field
        const phoneInput = screen.getByRole('textbox', { name: /phone/i });
        
        // Simulate changing the input to an invalid value
        fireEvent.change(phoneInput, { target: { value: '123abc' } });
        
        // Assert that the error message is displayed
        expect(screen.getByText('Phone number must be numeric')).toBeInTheDocument();
    });

    it('name should be updated when entered', () => {
        render(<AddCustomer onCloseForm={() => {}} />);
        
        const nameInput = screen.getByRole('textbox', {name: /name/i});

        fireEvent.change(nameInput, {target: {value: 'nick'}});

        expect(nameInput.value).toBe('nick');
    });
});


jest.mock('../store/apiFunctions');  // Mock the API call

describe('AddCustomer component', () => {

    it('should not submit when phone number not set', async () => {
        // Mock the postCustomer function to resolve successfully
        postCustomer.mockResolvedValueOnce({});
    
        render(<AddCustomer onCloseForm={() => {}} />);
    
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const submitButton = screen.getByRole('button', { name: /add customer/i });
    
        act(() => {
            
                // Simulate user input
                fireEvent.change(nameInput, { target: { value: 'Nick' } });
            
                // Simulate form submission
                fireEvent.click(submitButton);
    
        });
    
        await waitFor(() => {
            // Check that postCustomer was called with the correct payload
            expect(postCustomer).not.toHaveBeenCalled();
        });
    });


  it('should submit the form with correct values', async () => {
    // Mock the postCustomer function to resolve successfully
    postCustomer.mockResolvedValueOnce({});

    render(<AddCustomer onCloseForm={() => {}} />);

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const phoneInput = screen.getByRole('textbox', { name: /phone/i });
    const submitButton = screen.getByRole('button', { name: /add customer/i });

    act(() => {
        
            // Simulate user input
            fireEvent.change(nameInput, { target: { value: 'Nick' } });
            fireEvent.change(phoneInput, { target: { value: '123456789' } });
        
            // Simulate form submission
            fireEvent.click(submitButton);

    });

    await waitFor(() => {
        // Check that postCustomer was called with the correct payload
        expect(postCustomer).toHaveBeenCalledWith({
          id: 0,
          name: 'Nick',
          phone: '123456789',
        });
  
        // Check that the success message appears in the Snackbar
        expect(screen.getByText(/Customer added successfully!/i)).toBeInTheDocument();
      }, { timeout: 7000 }); // Adjust timeout if necessary
    });


});


