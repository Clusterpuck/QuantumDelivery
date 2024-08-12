import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';

// Dummy data
const DUMMY_INPUT = {
  "num_vehicle": 3,
  "orders": [
    { "order_id": 3, "lat": -90, "long": -180 },
    { "order_id": 2, "lat": -89, "long": -170 },
    { "order_id": 1, "lat": -89, "long": -180 }
  ]
};

const DUMMY_OUTPUT = [
  [{ "order_id": 2, "lat": -89, "long": -170, "x": -109.5, "y": -19.3, "z": -6370.03 }],
  [{ "order_id": 3, "lat": -90, "long": -180, "x": 0, "y": 0, "z": -6371 }],
  [{ "order_id": 1, "lat": -89, "long": -180, "x": -111.19, "y": 0, "z": -6370.03 }]
];

// Page design for View Routes page
const ViewRoutes = () =>
{
  const [selectedDate, setSelectedDate] = useState(null);
  const [routes, setRoutes] = useState([]);
  //can change in future for backend to handle this
  const [allOrders, setAllOrders] = useState([]);

  // Function to handle date change and load dummy output
  const handleDateChange = (date) =>
  {
    setSelectedDate(date);
    // Simulate sending date and input to a function to get the dummy output
    loadRoutes(DUMMY_INPUT);
  };

  const loadRoutes = (input) =>
  {
    // You could process the input data here before setting routes
    setRoutes(DUMMY_OUTPUT);
  };

  // Define columns for DataGrid
  const columns = [
    { field: 'order_id', headerName: 'Order ID', width: 90 },
    { field: 'lat', headerName: 'Latitude', width: 150 },
    { field: 'long', headerName: 'Longitude', width: 150 },
    { field: 'x', headerName: 'Address', width: 150 },
    { field: 'y', headerName: 'Status', width: 150 },
    { field: 'z', headerName: 'Product Names', width: 150 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <h1>View Routes</h1>
      <a href="/">Back Home</a>

      <Paper elevation={3} sx={{ padding: 3, maxWidth: 1200, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid xs = {6} >

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="MM/DD/YYYY"
              //value={value}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />

          </LocalizationProvider>

          </Grid>
          <Grid xs = {6}>
            <Button
              variant='outlined'
              //={loadOrders}
            >
              Plan Routes
            </Button>

          </Grid>

          {routes.map((route, index) => (
            <Grid item xs={12} key={index}>
              <h3>Vehicle {index + 1}</h3>
              <DataGrid
                rows={route.map((row, idx) => ({ id: idx, ...row }))}
                columns={columns}
                pageSize={5}
                autoHeight
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </div>
  );
};

export default ViewRoutes;
