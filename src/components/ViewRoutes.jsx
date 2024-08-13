import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid } from '@mui/x-data-grid';

// Dummy data
//NW Proposed to change to a simple list of numbers instead
const DUMMY_INPUT = {
  "num_vehicle": 3,
  "orders": [ 3, 2, 1 ]
  //   { "order_id": 3},
  //   { "order_id": 2},
  //   { "order_id": 1 }
  // ]
};

const DUMMY_OUTPUT = [
  {
    vehicle_id: 1,
    orders: [
      { 
        order_id: 1, 
        addr: "123 Gloucester St", 
        lat: 40.7128, 
        long: -74.0060, 
        status: "Delivered", 
        prodNames: ["Product A", "Product B"],
        customerName: "Amira" 
      },
      { 
        order_id: 2, 
        addr: "4 Rummer Way", 
        lat: 40.7328, 
        long: -74.0160, 
        status: "Cancelled", 
        prodNames: ["Product C"],
        customerName: "Nick" 
      }
    ]
  },
  {
    vehicle_id: 2,
    orders: [
      { 
        order_id: 3, 
        addr: "7 Kent St", 
        lat: 40.7528, 
        long: -74.0260, 
        status: "On Route", 
        prodNames: ["Product D", "Product E"] ,
        customerName: "Amelie"
      }
    ]
  },
  {
    vehicle_id: 3,
    orders: [
      { 
        order_id: 4, 
        addr: "101 Pine Rd", 
        lat: 40.7728, 
        long: -74.0360, 
        status: "Delivered", 
        prodNames: ["Product F"],
        customerName: "Agam"
      },
      { 
        order_id: 5, 
        addr: "202 Oak Dr", 
        lat: 40.7928, 
        long: -74.0460, 
        status: "On Route", 
        prodNames: ["Product G", "Product H"] ,
        customerName: "Song Yi"
      }
    ]
  }
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
    //{ field: 'lat', headerName: 'Latitude', width: 150 },
    //{ field: 'long', headerName: 'Longitude', width: 150 },
    { field: 'addr', headerName: 'Address', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'prodNames', headerName: 'Product Names', width: 500 , renderCell: (params) => params.value.join(', '
    )},
    {field: 'customerName', headerName: 'Customer Name', width: 150}

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

            {routes.map((vehicle, index) => (
              <Grid item xs={12} key={vehicle.vehicle_id}>
                <h3>Vehicle {vehicle.vehicle_id}</h3>
                <DataGrid
                  rows={vehicle.orders.map((order, idx) => ({ id: order.order_id, ...order }))}
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
