import React, { useState, useEffect } from "react";
import DriverViewRoutes from "./DriverViewRoutes";
import { TextField, MenuItem, Grid, Tooltip } from "@mui/material";
import { fetchMethod } from "../store/apiFunctions";
import dayjs from 'dayjs';
import { formatDate } from "../store/helperFunctions";


const AdminDriverNav = () =>
{

    const [drivers, setDrivers] = useState([])
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedDriver, setSelectedDriver] = useState('');
    const [allDrivers, setAllDrivers] = useState([]);

    useEffect(() =>
    {
        getDriverList();

    }, [selectedDate]);

    useEffect(() => {
        getAllDrivers();
    },[])

    const handleDriverChange = (event) =>
    {
        setSelectedDriver(event.target.value);
    }

    const getAllDrivers = async () =>
    {
        try
        {
            let response = await fetchMethod('Accounts');
            if (response)
            {
                console.log("xxXXAccounts result is " + JSON.stringify(response));

                // Filter for drivers and extract usernames
                const driverUsernames = response
                    .filter(account => account.role === 'DRIVER')
                    .map(driver => driver.username);

                // Update state with driver usernames
                setAllDrivers(driverUsernames);
                // Set the first driver as selected if available
                if (drivers && drivers.length == 0 && driverUsernames)
                {
                    setSelectedDriver(driverUsernames[0]);
                }

            }
        } catch (error)
        {
            console.error("Error fetching driver list:", error);
        }
    };



    const getDriverList = async () =>
    {
        setDrivers([])
        try
        {
            const endpoint = 'Accounts/activedrivers/' + selectedDate.toISOString();
            console.log("xxXXtrying with end point " + endpoint);
            let response = await fetchMethod(endpoint);//'Accounts');
            if( response )
            {
                console.log("xxXXAccounts result is " + JSON.stringify(response));
    
                // Filter for drivers and extract usernames
                const driverUsernames = response
                    .filter(account => account.role === 'DRIVER')
                    .map(driver => driver.username);
    
                // Update state with driver usernames
                setDrivers(driverUsernames);
                // Set the first driver as selected if available
                if (driverUsernames.length > 0)
                {
                    setSelectedDriver(driverUsernames[0]);
                }

            }
        } catch (error)
        {
            console.error("Error fetching driver list:", error);
        }
    };

    return (
        <Grid container mt={20} justifyContent="flex-end">
            <Grid xs={3} md={3}>
                <Tooltip title={"Drivers with routes on date: " + formatDate(selectedDate)}>
                    <TextField
                        select
                        label={drivers.length === 0 ? "No drivers on routes" : "Active Drivers"}
                        value={selectedDriver}
                        fullWidth
                        onChange={handleDriverChange}
                        disabled={drivers.length === 0}  // Disable if no drivers
                        sx={{ zIndex: 1000 }}  // Ensures the dropdown appears on top
                    >
                        {drivers.length > 0 ? (
                            drivers.map(driver => (
                                <MenuItem key={driver} value={driver}>
                                    {driver}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No drivers available</MenuItem>  // Optional fallback
                        )}
                    </TextField>
                </Tooltip>
            </Grid>
            <DriverViewRoutes inputUser={selectedDriver} selectedDateChange={setSelectedDate} />
        </Grid>
    )

}

export default AdminDriverNav;