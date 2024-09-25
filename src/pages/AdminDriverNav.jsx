import React, { useState, useEffect } from "react";
import DriverViewRoutes from "./DriverViewRoutes";
import { TextField, MenuItem, Grid } from "@mui/material";
import { fetchMethod } from "../store/apiFunctions";


const AdminDriverNav = () =>
{
    
    const [drivers, setDrivers] = useState([])
    const [selectedDriver, setSelectedDriver] = useState('');

    useEffect(() =>
        {
            getDriverList();
    
        }, []);

    const handleDriverChange = (event) =>
    {
        setSelectedDriver(event.target.value);
    }

    const getDriverList = async () => {
        try {
            let response = await fetchMethod('Accounts');
            console.log("xxXXAccounts result is " + JSON.stringify(response));

            // Filter for drivers and extract usernames
            const driverUsernames = response
                .filter(account => account.role === 'DRIVER')
                .map(driver => driver.username);

            // Update state with driver usernames
            setDrivers(driverUsernames);
            // Set the first driver as selected if available
            if (driverUsernames.length > 0) {
                setSelectedDriver(driverUsernames[0]);
            }
        } catch (error) {
            console.error("Error fetching driver list:", error);
        }
    };

    return(
        <Grid container mt={20}>
            <Grid xs={3} md={3}>
            <TextField
                select
                label="Driver"
                value={selectedDriver}
                fullWidth
                onChange={handleDriverChange}
                sx={{ zIndex: 1000 }}  // Ensures the dropdown appears on top
            >
                {drivers.map(driver => (
                    <MenuItem key={driver} value={driver}>
                        {driver}
                    </MenuItem>
                ))}
            </TextField>
            </Grid>
            <DriverViewRoutes inputUser={selectedDriver} />
            </Grid>
    )

}

export default AdminDriverNav;