import AddCustomer from '../components/AddCustomer';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';



test('renders AddCustomer component', () => {
    render(<AddCustomer onCloseForm={() => {}} />);
    expect(screen.getByText('Add Customer')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Add Customer')).toBeInTheDocument();
  });