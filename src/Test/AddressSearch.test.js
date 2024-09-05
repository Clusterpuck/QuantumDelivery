import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddressSearch from '../components/AddressSearch';
import { fetchRegion, postLocation } from '../store/apiFunctions';
import { useConfirmAddress } from '@mapbox/search-js-react';

// Mock the external functions and components
jest.mock('../store/apiFunctions', () => ({
  fetchRegion: jest.fn(),
  postLocation: jest.fn(),
}));

jest.mock('@mapbox/search-js-react', () => ({
  useConfirmAddress: jest.fn(),
  AddressAutofill: ({ children }) => children,
  AddressMinimap: () => null,
}));

describe('AddressSearch component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

 

    it('renders the form elements correctly', () => {
        // Render the AddCustomer component
        render(<AddressSearch onCloseForm={() => {}} />);
        
        // Check if the phone input field is rendered
        const addressInput = screen.getByRole('textbox', { name: /address-line1/i });
        expect(addressInput).toBeInTheDocument();

    });


//   it('should call postLocation with correct data on form submission', async () => {
//     fetchRegion.mockResolvedValueOnce({
//       latitude: 37.7749,
//       longitude: -122.4194,
//     });

//     useConfirmAddress.mockReturnValue({
//       formRef: { current: { reset: jest.fn() } },
//       showConfirm: jest.fn().mockResolvedValue({ type: 'nochange' }),
//     });

//     render(<AddressSearch onCloseForm={() => {}} />);

//     // Fill out the form
//     fireEvent.change(screen.getByRole('textbox', { name: /address/i }), { target: { value: '123 Main St' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /apartment, suite, etc. \(optional\)/i }), { target: { value: 'Apt 4B' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /city/i }), { target: { value: 'San Francisco' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /state \/ region/i }), { target: { value: 'CA' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /zip \/ postcode/i }), { target: { value: '94103' } });

//     // Simulate form submission
//     fireEvent.click(screen.getByRole('button', { name: /add location/i }));

//     await waitFor(() => {
//       // Verify postLocation was called with correct data
//       expect(postLocation).toHaveBeenCalledWith({
//         longitude: -122.4194,
//         latitude: 37.7749,
//         address: '123 Main St',
//         suburb: 'San Francisco',
//         state: 'CA',
//         country: 'Australia',
//         description: 'Apt 4B',
//       });
//     });
//   });

//   it('should call handleResetMap and onCloseForm after form submission', async () => {
//     fetchRegion.mockResolvedValueOnce({
//       latitude: 37.7749,
//       longitude: -122.4194,
//     });

//     const onCloseForm = jest.fn();
//     useConfirmAddress.mockReturnValue({
//       formRef: { current: { reset: jest.fn() } },
//       showConfirm: jest.fn().mockResolvedValue({ type: 'nochange' }),
//     });

//     render(<AddressSearch onCloseForm={onCloseForm} />);

//     // Fill out the form and submit
//     fireEvent.change(screen.getByRole('textbox', { name: /address/i }), { target: { value: '123 Main St' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /apartment, suite, etc. \(optional\)/i }), { target: { value: 'Apt 4B' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /city/i }), { target: { value: 'San Francisco' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /state \/ region/i }), { target: { value: 'CA' } });
//     fireEvent.change(screen.getByRole('textbox', { name: /zip \/ postcode/i }), { target: { value: '94103' } });

//     fireEvent.click(screen.getByRole('button', { name: /add location/i }));

//     await waitFor(() => {
//       // Verify that handleResetMap and onCloseForm were called
//       expect(onCloseForm).toHaveBeenCalled();
//     });
//   });


});
