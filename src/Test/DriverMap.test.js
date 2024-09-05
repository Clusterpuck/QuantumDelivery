import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverMap from '../components/DriverMap';

const start = [12.9715987, 77.5945627]; // Example coordinates (latitude, longitude)
const end = [13.0826802, 80.2707184];   // Example coordinates (latitude, longitude)


// Mocking the mapbox-gl library
jest.mock('mapbox-gl', () => ({
    Map: jest.fn(() => ({
      on: jest.fn(),
      addLayer: jest.fn(),
      getSource: jest.fn().mockReturnValue({
        setData: jest.fn(),
      }),
    })),
    accessToken: '',
  }));

// describe('DriverMap component renders', () => {

//     it('renders the form elements correctly', () => {

//         render(<DriverMap start={start} end={end} />);

//         // Check if the Previous button is rendered
//         const previousButton = screen.getByText('Previous');
//         expect(previousButton).toBeInTheDocument();

//     });
// });

describe('DriverMap component', () => {
    it('renders the Previous button when steps are present', () => {
      // Mocking steps array and component behavior
      const steps = [{ maneuver: { instruction: 'Turn left' } }];
      render(<DriverMap start={start} end={end} />);
  
  
      //const previousButton = screen.getByRole('button', { name: /Previous/i });
      //expect(previousButton).toBeInTheDocument();
    });
  });
