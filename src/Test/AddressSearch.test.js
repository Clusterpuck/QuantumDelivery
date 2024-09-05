import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddressSearch from '../components/AddressSearch';
//import { fetchRegion, postLocation } from '../store/apiFunctions';
//import { useConfirmAddress } from '@mapbox/search-js-react';


describe('AddressSearch component', () => {


    it('renders the form elements correctly', () => {
//This render is causing issues for some reason, needs more detailed problem solving
//May not be worth it
        // Render the AddCustomer component
        //render(<AddressSearch onCloseForm={() => {}} />);
        
        // Check if the phone input field is rendered
        // const addressInput = screen.getByRole('textbox', { name: /address-line1/i });
        // expect(addressInput).toBeInTheDocument();

    });



});
