import React, { useState, useEffect } from 'react';
import { postDeliveryRoutes, fetchMethod, fetchNumVehicles } from '../store/apiFunctions';
// Date Picker
import DateSelectHighlight from '../components/DateSelectHighlight.jsx';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { useTheme } from '@mui/material/styles';
import WarehouseIcon from '@mui/icons-material/Warehouse';

// Material-UI Icons
import AltRouteIcon from '@mui/icons-material/AltRoute';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import OrdersTable from '../components/OrdersTable.jsx';
import CustomLoading from '../components/CustomLoading.jsx';
import
{
    TextField, Button, Grid, MenuItem, Typography, InputAdornment, Radio, RadioGroup,
    FormControlLabel, Skeleton
} from '@mui/material';

const AddRouteForm = ({ updateRoutes, closeView }) =>
{

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [unassignedDates, setUnassignedDates] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true); // Track if orders are loaded
    const [plannedOrders, setPlannedOrders] = useState([]);
    const [datePlannedOrders, setDatePlannedOrders] = useState([]);
    const [numVehicles, setNumVehicles] = useState(1); // default to 1 vehicle
    const [calcType, setCalcType] = useState("brute");
    const [routesLoading, setRoutesLoading] = useState(false);
    const [maxVehicle, setMaxVehicle] = useState(1);
    const [loadingMaxVehicle, setLoadingMaxVehicle] = useState(true);


    // Depot handling
    const depots = [
        { id: 1, name: "Depot A" },
        { id: 2, name: "Depot B" },
        { id: 3, name: "Depot C" },
        { id: 4, name: "Depot D" },
    ];
    const [selectedDepot, setSelectedDepot] = useState(depots[0].id);

    const theme = useTheme();



    /**
     * If orders are loaded and the datePlanned orders are defined and have values
     * Meaning there are orders that aren't assigned on the selected date
     * A request with those orders are sent to determine the routes
     * Runs load orders if routes are calculated correctly. 
     *
     * @async
     * @returns {*}
     */
    const calcRoutes = async () =>
    {
        try
        {
            setRoutesLoading(true);
            if (!datePlannedOrders) return; // Do not load routes if orders are not loaded
            if (!datePlannedOrders || datePlannedOrders.length == 0) return;
            const userInput = {
                numVehicle: numVehicles,
                calcType: calcType,
                deliveryDate: selectedDate,
                depot: selectedDepot,
                orders: datePlannedOrders.
                    map(order => order.orderID) // all orders
            };

            //console.log("Payload being sent: ", JSON.stringify(userInput));
            await postDeliveryRoutes(userInput);
            //needs to return all routes, not just new routes
            updateRoutes();
            //send instead of relying on set due to asynch setting
            //resets order list after them being assigned to routes
            closeView();

        } catch (error)
        {
            // catch error
            console.error('Error fetching delivery routes: ', error);
            setSnackbar({
                open: true,
                message: 'Failed to load delivery routes',
                severity: 'error'
            });
        } finally
        {
            setRoutesLoading(false);
        }

    }


    /**
     * Load orders then sort by position number
     * and filter to planned only 
     *
     * @async
     * @returns {*}
     */
    const loadOrders = async () =>
    {
        setOrdersLoading(true);
        const ordersList = await fetchMethod("orders");
        if (ordersList)
        {

            //console.log("Order list is " + JSON.stringify(ordersList));
            const filteredOrders = ordersList.filter(order => order.status === "PLANNED");
            const sortedOrderList = filteredOrders.sort((a, b) => a.position - b.position);
            // Filter orders where the status is "PLANNED" and the DeliverDate matches the selected date
            // Filter orders where the status is "PLANNED" (initial fetch)
            setPlannedOrders(sortedOrderList);  // Save all planned orders
            // Filter the saved planned orders by the selected date
            filterByDate(selectedDate);
            extractOrderDates(filteredOrders);

        } else
        {
            console.error('Error fetching orders:', error);
            setSnackbar({
                open: true,
                message: 'Failed to load orders',
                severity: 'error'
            });
        }
        setOrdersLoading(false);
    };



    /**
     * Function to handle date change and load dummy output
     *
     * @param {*} date
     */
    const handleDateChange = (date) =>
    {
        setSelectedDate(date);
        //filter orders by new date
        filterByDate(date);

        settingMaxVechicles(date);
    };

    const settingMaxVechicles = async (date) => {
        console.log("In add route, date is " + JSON.stringify(date));

        setLoadingMaxVehicle(true);
        let tempMaxVehicles = await fetchNumVehicles(date);
        setLoadingMaxVehicle(false);
        console.log("Got a max vehicle of " + tempMaxVehicles);
        setMaxVehicle(tempMaxVehicles);

    }


    /**
     * Handle num vehicles change
     * sets the drop down value for vehicles
     *
     * @param {*} event
     */
    const handleNumVehiclesChange = (event) =>
    {
        setNumVehicles(event.target.value);
    };

    const handleDepotChange = (event) =>
    {
        setSelectedDepot(Number(event.target.value));
    };



    /** Forms a list of current dates that there are routes planned */
    function extractOrderDates(inOrders)
    {
        const newDateList = [];

        // Iterate over routes and orders, but only add unique dates
        inOrders.forEach(order =>
        {
            const routeDate = dayjs(order.deliveryDate);

            // Check if the same day, month, and year already exists in newDateList
            const isDuplicate = newDateList.some(
                date => dayjs(date).isSame(routeDate, 'day')
            );

            // Add to list if it's not a duplicate
            if (!isDuplicate)
            {
                newDateList.push(order.deliveryDate);
            }
        });

        setUnassignedDates(newDateList);

    }



    /**
     * Filters all the orders that are planned to only orders
     * in the selected date. 
     *
     * @param {*} newDate
     */
    function filterByDate(newDate)
    {
        const selectedDateFormatted = newDate.startOf('day');
        const filteredOrders = plannedOrders.filter(order =>
        {
            const orderDeliverDate = dayjs(order.deliveryDate).startOf('day');
            return orderDeliverDate.isSame(selectedDateFormatted);
        });
        //console.log("xxXXFiltered orders is ", JSON.stringify(filteredOrders));

        setDatePlannedOrders(filteredOrders); // Save the date-filtered orders

    }


    /**
     * Handles the selector changing calc type between brute and quantum
     *
     * @param {*} event
     */
    const handleCalcChange = (event) =>
    {
        setCalcType(event.target.value)
        // console.log("Calc changed to ", event.target.value);

    }



    /**
     * Uses conditionals to determine the correct component to return
     * based on maxvehicle and the loading state
     *
     * @returns {*}
     */
    const VehiclePicker = () =>
    {
        if (loadingMaxVehicle)
        {
            return (
                <Skeleton sx={{
                    width: '100%',  // Make it responsive to parent container
                    height: '100px', // Auto-adjust height for responsiveness
                }} />
            );
        }
        else if( maxVehicle > 0 )
        {
            //normla vehicle selection available
            return (
                <TextField
                    select
                    label="Number of Vehicles"
                    value={numVehicles}
                    fullWidth
                    onChange={handleNumVehiclesChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocalShippingIcon />
                            </InputAdornment>
                        ),
                    }}
                >
                        {[...Array(maxVehicle).keys()].map(i => (
                    <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                    </MenuItem>
                        ))}
                   
                    
                </TextField>

            );
        }else{
            //no vehicles available
            return (
                <TextField
                    select
                    label="Number of Vehicles"
                    fullWidth
                    value=''
                    onChange={handleNumVehiclesChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocalShippingIcon />
                            </InputAdornment>
                        ),
                    }}
                >
                    <MenuItem value={0} disabled>
                        None available
                    </MenuItem>
                </TextField>

            );

        }
    }




    useEffect(() =>
    {
        loadOrders();
        settingMaxVechicles(selectedDate);

    }, []);

    useEffect(() =>
    {
        if (plannedOrders && selectedDate)
        {
            filterByDate(selectedDate);
        }
    }, [plannedOrders, selectedDate]);



    return (

        <Grid item xs={12} md={12} container spacing={2}>
            <Grid item xs={12} md={12} container spacing={2} alignItems="center">
                {/**date selection */}
                <Grid item xs={6} md={3} >
                    {ordersLoading ? <Skeleton sx={{
                        width: '100%',  // Make it responsive to parent container
                        height: '100px', // Auto-adjust height for responsiveness
                    }} /> :

                        <DateSelectHighlight highlightedDates={unassignedDates} selectedDate={selectedDate} handleDateChange={handleDateChange} />
                    }
                </Grid>
                {/* Dropdown for selecting number of vehicles and Regenerate button */}
                <Grid item xs={6} md={3}>
                   <VehiclePicker/>

                </Grid>
                {/*Depot drop down menu*/}
                <Grid item xs={6} md={3}>
                    <TextField
                        select
                        label="Depot"
                        value={selectedDepot}
                        fullWidth
                        onChange={handleDepotChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <WarehouseIcon />
                                </InputAdornment>
                            ),
                        }}
                    >
                        {depots.map(depot => (
                            <MenuItem key={depot.id} value={depot.id}>
                                {depot.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                {/**Calc type selection */}
                <Grid item xs={6} md={3}>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={calcType}
                        onChange={handleCalcChange}
                    >
                        <FormControlLabel value="brute" control={<Radio />} label="Brute Force" />
                        <FormControlLabel value="dwave" control={<Radio />} label="Quantum Computer" />
                    </RadioGroup>
                </Grid>
                {/**Calculate routes button */}
                <Grid item xs={12} md={12} container justifyContent="center">
                    {routesLoading ? (
                        <Button
                            variant='contained'
                            color='secondary'
                            sx={{ height: '100%' }}
                        >
                            <CustomLoading />
                        </Button>
                    ) : (
                        <Button
                            disabled={datePlannedOrders?.length == 0 || maxVehicle == 0}
                            variant='contained'
                            sx={{ height: '100%' }}
                            onClick={calcRoutes} // Call loadRoutes on button click
                        >

                            <AltRouteIcon />

                            Calculate Routes
                        </Button>
                    )}
                </Grid>
            </Grid>

            {/* unassigned orders component */}
            <Grid item xs={12} md={12} container spacing={2} alignItems="center" maxWidth='1200px'>
                {ordersLoading ? <Skeleton sx={{
                    width: '100%',  // Make it responsive to parent container
                    height: '100px', // Auto-adjust height for responsiveness
                }} /> :
                    (
                        <>
                            <Typography variant="h6">
                                Unassigned Orders: {datePlannedOrders.length}
                            </Typography>
                            <OrdersTable orders={datePlannedOrders} />
                        </>

                    )}
            </Grid>
        </Grid>
    )
}

export default AddRouteForm;