import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCustomer from '../components/AddCustomer';

describe('AddCustomer component', () => {
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
});
