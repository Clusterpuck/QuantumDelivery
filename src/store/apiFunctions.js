import * as Constants from '../Constants.js';
import {formatDate } from './helperFunctions.js';

export const fetchRegion = async () => {
    let data = null
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch IP address');
        }
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        console.log("Ip is " + userIP);

        // Use user's IP address to fetch region information
        const response = await fetch(`https://ipapi.co/${userIP}/json/`);
        if (!response.ok) {
            console.log("error in fetch region response")
            throw new Error('Failed to fetch location information');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching region:', error.message);
    }
    return data
};

export const fetchCustomers = async () => {
    let ipData = null
    try {
        const ipResponse = await fetch( Constants.DATA_ENDPOINT + 'customers');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch IP address');
        }
        ipData = await ipResponse.json();
        //console.log("Data is " + JSON.stringify(ipData) );
        // Use user's IP address to fetch region information
    } catch (error) {
        console.error('Error fetching region:', error.message);
    }
    return ipData
};

export const fetchLocations = async () => {
    let ipData = null
    try {
        const ipResponse = await fetch( Constants.DATA_ENDPOINT + 'locations');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch IP address');
        }
        ipData = await ipResponse.json();
        //console.log("Data is " + JSON.stringify(ipData) );
        // Use user's IP address to fetch region information
    } catch (error) {
        console.error('Error fetching region:', error.message);
    }
    return ipData
};


export const fetchProducts = async () => {
    let ipData = null
    try {
        const ipResponse = await fetch( Constants.DATA_ENDPOINT + 'products');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch product data');
        }
        ipData = await ipResponse.json();
        //console.log("Data is " + JSON.stringify(ipData) );
        // Use user's IP address to fetch region information
    } catch (error) {
        console.error('Error fetching region:', error.message);
    }
    return ipData
};



export const postLocation = async (newLocation) => {
    try {
        const response = await fetch( Constants.DATA_ENDPOINT + 'locations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLocation),
        });

        if (!response.ok) {
            throw new Error('Failed to submit address');
        }

        // Handle the response if needed (e.g., display a success message)
        const responseData = await response.json();
        console.log('Successfully submitted address:', responseData);

    } catch (error) {
        console.error('Error submitting address:', error);
    }
}


export const postCustomer = async (newCustomer) => {
    try {
        const response = await fetch( Constants.DATA_ENDPOINT + 'customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        });

        if (!response.ok) {
            throw new Error('Failed to submit customer');
        }

        // Handle the response if needed (e.g., display a success message)
        const responseData = await response.json();
        console.log('Successfully submitted customer:', responseData);

    } catch (error) {
        console.error('Error submitting customer:', error);
    }
}

//generic post method that accepts data and string of endpoint to send to database
//may need to change to throw exceptions further to give speicific call data
export const postMethod = async (newData, endPoint) => {
    try {
        const response = await fetch( Constants.DATA_ENDPOINT + endPoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });

        if (!response.ok) {
            throw new Error('Failed to submit data', 'on end point ', endPoint);
        }

        // Handle the response if needed (e.g., display a success message)
        const responseData = await response.json();
        console.log('Successfully submitted data:', responseData, 'on end point ', endPoint);
        return responseData;

    } catch (error) {
        console.error('Error submitting data: ', error, 'on end point ', endPoint);
        return null;
    }
}



export const fetchMethod = async (endpoint) => {
    let ipData = null
    try {
        const ipResponse = await fetch( Constants.DATA_ENDPOINT + endpoint);
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch from endpoint ', endpoint);
        }
        ipData = await ipResponse.json();
        // console.log("Fetch Method. Data is " + JSON.stringify(ipData) );
        // Use user's IP address to fetch region information
    } catch (error) {
        console.error('Error fetching from endpoint:', endpoint,' ', error.message);
    }
    return ipData
};

export const deleteMethod = async (id, endPoint) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}${endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete data with ID: ' + id + ' on end point ' + endPoint);
        }

        // Handle the response if needed (e.g., confirm successful deletion)
        const responseData = await response.json();
        console.log('Successfully deleted data with ID:', id, 'on end point', endPoint);
        return responseData;

    } catch (error) {
        console.error('Error deleting data with ID:', id, 'on end point', endPoint, ' ', error.message);
        return null;
    }
};

export const fetchDeliveryRoute = async (driverUsername) => {
    let deliveryRouteData = null;
    console.log("SENDING USERNAME: ", driverUsername);
    try {
        const endpoint = `DeliveryRoutes/driver/${driverUsername}`;
        const response = await fetch(`${Constants.DATA_ENDPOINT}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from endpoint ${endpoint}: ${response.statusText}`);
        }

        deliveryRouteData = await response.json();
        console.log("Delivery route data is: ", JSON.stringify(deliveryRouteData));
    } catch (error) {
        console.error('Error fetching from endpoint:', error.message);
    }
    return deliveryRouteData;
};

export const postDeliveryRoutes = async (newInput) => {
    try {
        console.log("sending ", JSON.stringify(newInput));
        const response = await fetch(Constants.DATA_ENDPOINT + 'deliveryroutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newInput),
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to submit delivery route');
        }

        const responseData = await response.json();
        console.log('Successfully submitted delivery route:', responseData);
        return responseData; 

    } catch (error) {
        console.error('Error submitting delivery route:', error);
        return null; 
    }
};

export const startDeliveryRoute = async(routeId) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}deliveryroutes/start/${routeId}`, {
            method: 'PUT',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to start delivery route');
        } else {
            console.log("Started delivery route!");
        }
    } catch (error) {
        console.error('Error starting delivery route:', error);
    }
};

///Input is: const input = {
//     username: driverUsername,
//     orderId: currentDelivery.orderId,
//     status: "DELIVERED"
// };
export const updateOrderStatusFromRoute = async(input) =>{
    console.log("xxXXBody to send to update status " + JSON.stringify(input))
    try{
        const response = await fetch(Constants.DATA_ENDPOINT + 'deliveryroutes/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            console.error('xxXXResponse status:', response.status);
            console.error('xxXXResponse status text:', response.statusText);
            throw new Error('Failed to update order status.');
        }
        const responseData = await response.json();
        console.log('xxXXSuccessfully updated order status: ', responseData);
        return responseData; 

    } catch (error) {
        console.error('xxXXError updating order status: ', error);
        return null; 
    }
}

///Input is: const input = {
//     username: driverUsername,
//     orderId: currentDelivery.orderId,
//     delayed: "true"
// };
export const updateOrderDelayed = async(input) =>{
    try{
        const response = await fetch(Constants.DATA_ENDPOINT + 'deliveryroutes/update-delayed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to set order as delayed.');
        }
        const responseData = await response.json();
        console.log('Successfully set order as delayed ', responseData);
        return responseData; 

    } catch (error) {
        console.error('Error setting order as delayed: ', error);
        return null; 
    }
}

///Input is: const input = {
//     username: driverUsername,
//     orderId: currentDelivery.orderId,
//     driverNote: "example driver note"
// };
export const updateOrderIssue = async(input) =>{
    try{
        const response = await fetch(Constants.DATA_ENDPOINT + 'deliveryroutes/update-issue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to set order status to issue.');
        }
        const responseData = await response.json();
        console.log('Successfully set order status to issue.', responseData);
        return responseData; 

    } catch (error) {
        console.error('Error setting order status as issue: ', error);
        return null; 
    }
}

export const login = async (username, password) => {
    try {
        const response = await fetch(Constants.DATA_ENDPOINT + 'accounts/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username: username, Password: password }),
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to login');
        }

        const responseData = await response.json();
        console.log('Successfully logged in:', responseData);
        return responseData; // Return the response data (e.g., JWT token)

    } catch (error) {
        console.error('Error logging in:', error);
        return null; // Return null or handle the error as needed
    }
};

export const fetchIssueOrders = async () => {
    let orderData = null
    try {
        const orderResponse = await fetch( Constants.DATA_ENDPOINT + 'orders/issues');
        if (!orderResponse.ok) {
            throw new Error('Failed to fetch issue orders data');
        }
        orderData = await orderResponse.json();
    } catch (error) {
        console.error('Error fetching issue orders data:', error.message);
    }
    return orderData
};

///Input is: const input = {
//     orderId: currentDelivery.orderId,
//     status: "CANCELLED"
// };
export const updateOrderStatus  = async(input) =>{
    try{
        const encodedAccountId = encodeURIComponent(accountId);
        const response = await fetch(`${Constants.DATA_ENDPOINT}accounts/${encodedAccountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAccountData),
        });
        

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to update order status.');
        }
        const responseData = await response.json();
        console.log('Successfully updated order status: ', responseData);
        return responseData; 

    } catch (error) {
        console.error('Error updating order status: ', error);
        return null; 
    }
}

export const editAccount = async (accountId, updatedAccountData) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}accounts/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAccountData),
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to update account details');
        }

        const responseData = await response.json();
        console.log('Successfully updated account details:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error updating account details:', error);
        return null;
    }
};

export const createAccount = async (newAccountData) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAccountData),
        });

        if (!response.ok) {
            const errorData = await response.json();  // Parse error response for detailed information
            console.error('Error from API:', errorData);
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error(`Failed to create account: ${errorData.detail || 'Unknown error'}`);
        }

        const responseData = await response.json();
        console.log('Successfully created account:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error creating account:', error);
        return null;
    }
};


// account id is the USERNAME and it is stored in the user's cookie for easy access
export const getAccountDetails = async (accountId) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}accounts/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error(`Failed to fetch account details for account ID: ${accountId}`);
        }

        const responseData = await response.json();
        console.log('Successfully fetched account details for:' + accountId);
        return responseData;

    } catch (error) {
        console.error('Error fetching account details:', error);
        return null; 
    }
};

/**
 * Function to delete an account by its ID
 * @param {string} accountId - The ID of the account to be deleted
 * @returns {Promise<Object>} - The response object from the server
 */
export const deleteAccount = async (accountId) => { // Add 'async' keyword here
   
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}accounts/${accountId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add any authentication tokens or headers here if needed
            },
        });

        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error deleting account');
        }

        const data = await response.json(); // This may not be necessary if your DELETE response doesn't return data
        return data; // Return the success message or any other relevant data
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error; 
    }
};


///Input is: const input = {
//  "orderId": 0,
//  "status": "string",
//  "customerId": 0,
//  "locationId": 0,
//  "deliveryDate": "2024-09-22T05:15:09.115Z",
//  "orderNotes": "string",
//  "products": [
//    {
//      "productId": 0,
//      "quantity": 0
//    }
//  ]
//}
export const updateOrderDetails = async (input) => {
    const response = await fetch(`${Constants.DATA_ENDPOINT}orders/${input.orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    // Check if the response is not OK
    if (!response.ok) {
        const errorText = await response.text(); // Get the error message from the response body
        return `Error: ${errorText}`;
    } else {
        return "Order details successfully updated";  // Return success message if request was OK
    }
}

// Function to create a new product
export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData), // Convert productData to JSON
        });

        if (!response.ok) {
            console.error('Error creating product, status:', response.status);
            throw new Error('Failed to create product');
        }

        const responseData = await response.json(); // Parse response as JSON
        return responseData; // Return the created product details
    } catch (error) {
        console.error('Error creating product:', error);
        throw error; 
    }
};

// get product details by ID
export const getProductDetails = async (productId) => {
    const idAsInt = parseInt(productId, 10); // Convert to integer
    if (isNaN(idAsInt)) {
        throw new Error('Invalid product ID: must be an integer');
    }

    console.log('Fetching product details for ID:', idAsInt); // Log the product ID being fetched
    try {
        const url = `${Constants.DATA_ENDPOINT}products/${idAsInt}`;
        console.log(`Fetching product details from: ${url}`); // Log the full URL

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // Capture response text for detailed error
            console.error(`Error fetching product details for ID ${idAsInt}, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to fetch product details');
        }

        const responseData = await response.json(); // Parse response as JSON
        return responseData; // Return the product details
    } catch (error) {
        console.error('Error fetching product details:', error);
        throw error; 
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const id = parseInt(productId, 10); // Ensure productId is an integer

        // Use formData directly if structure is correct
        const requestData = {
            Name: productData.Name, // Assuming productData comes directly from formData
            UnitOfMeasure: productData.UnitOfMeasure,
        };

        // Check for empty values
        if (!requestData.Name || !requestData.UnitOfMeasure) {
            throw new Error("Name and UnitOfMeasure are required fields.");
        }

        const response = await fetch(`${Constants.DATA_ENDPOINT}products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // Use the mapped requestData
        });

        // Check if response is not ok
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Validation errors:', errorDetails); // Log the entire error details
            throw new Error(`Failed to update product. Errors: ${JSON.stringify(errorDetails)}`);
        }

        const responseData = await response.json(); // Parse response as JSON
        return responseData; // Return the updated product details
    } catch (error) {
        console.error('Error updating product:', error);
        throw error; 
    }
};


// deletes product by its ID
export const deleteProduct = async (productId) => {
    try {
        // Ensure productId is an integer
        const id = parseInt(productId, 10);
        const response = await fetch(`${Constants.DATA_ENDPOINT}products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);
            throw new Error('Failed to delete the product');
        }

        const responseData = await response.json();
        console.log('Product deleted successfully:', responseData.message);
        return responseData;

    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
};

// deletes customer by their ID
export const deleteCustomer = async (customerId) => {
    try {
        // ensure customerId is an integer
        const id = parseInt(customerId, 10);
        const response = await fetch(`${Constants.DATA_ENDPOINT}customers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // cxheck if the response is successful
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);

            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData || 'Customer has associated active orders.');
            } else if (response.status === 404) {
                throw new Error('Customer not found.');
            } else {
                throw new Error('Failed to delete the customer.');
            }
        }

        const responseData = await response.json();
        console.log('Customer deleted successfully:', responseData.message);
        return responseData.message;

    } catch (error) {
        console.error('Error deleting customer:', error);
        return null;
    }
};

// create a new customer
export const createCustomer = async (customerData) => {
    if (!customerData || !customerData.Name || !customerData.Phone) {
        throw new Error('Customer name and phone are required to create a customer.');
    }

    console.log('Creating new customer:', customerData); // log the customer data being sent
    try {
        const url = `${Constants.DATA_ENDPOINT}customers`; // URL for the POST request
        console.log(`Sending POST request to: ${url}`); // log the full URL

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData), // convert customerData to JSON string
        });

        if (!response.ok) {
            const errorText = await response.text(); // capture response text for detailed error
            console.error(`Error creating customer, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to create customer');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the created customer data
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error; 
    }
};

// edit an existing customer
export const updateCustomer = async (customerId, customerData) => {
    const idAsInt = parseInt(customerId, 10); // convert customerId to integer
    if (isNaN(idAsInt)) {
        throw new Error('Invalid customer ID: must be an integer');
    }

    if (!customerData || !customerData.Name || !customerData.Phone) {
        throw new Error('Customer name and phone are required to edit a customer.');
    }

    console.log('Editing customer:', idAsInt, customerData); // log the customer data being sent
    try {
        const url = `${Constants.DATA_ENDPOINT}customers/${idAsInt}`; 
        console.log(`Sending PUT request to: ${url}`); 

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData), // convert customerData to JSON string
        });

        if (!response.ok) {
            const errorText = await response.text(); // capture response text for detailed error
            console.error(`Error editing customer, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to edit customer');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the updated customer data
    } catch (error) {
        console.error('Error editing customer:', error);
        throw error; 
    }
};

// get customer details by ID
export const getCustomerDetails = async (customerId) => {
    const idAsInt = parseInt(customerId, 10); // convert customerId to integer
    if (isNaN(idAsInt)) {
        throw new Error('Invalid customer ID: must be an integer');
    }

    console.log('Fetching customer details for ID:', idAsInt); // log the customer ID being fetched
    try {
        const url = `${Constants.DATA_ENDPOINT}customers/${idAsInt}`; 
        console.log(`Fetching customer details from: ${url}`); // log the full URL

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // capture response text for detailed error
            console.error(`Error fetching customer details for ID ${idAsInt}, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to fetch customer details');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the customer details
    } catch (error) {
        console.error('Error fetching customer details:', error);
        throw error; 
    }
};


// deletes location by its ID
export const deleteLocation = async (locationId) => {
    try {
        // ensure locationId is an integer
        const id = parseInt(locationId, 10);
        const response = await fetch(`${Constants.DATA_ENDPOINT}locations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // check if the response is successful
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response status text:', response.statusText);

            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData || 'Cannot delete location due to associated ongoing orders.');
            } else if (response.status === 404) {
                throw new Error('Location not found.');
            } else {
                throw new Error('Failed to delete the location.');
            }
        }

        const responseData = await response.json();
        console.log('Location deleted successfully:', responseData.message);
        return responseData.message;

    } catch (error) {
        console.error('Error deleting location:', error);
        return null;
    }
};

// get location details by ID
export const getLocationDetails = async (locationId) => {
    const idAsInt = parseInt(locationId, 10); // convert to integer
    if (isNaN(idAsInt)) {
        throw new Error('Invalid location ID: must be an integer');
    }

    console.log('Fetching location details for ID:', idAsInt); // log the location ID being fetched
    try {
        const url = `${Constants.DATA_ENDPOINT}locations/${idAsInt}`;
        console.log(`Fetching location details from: ${url}`); 

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // capture response text for detailed error
            console.error(`Error fetching location details for ID ${idAsInt}, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to fetch location details');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the location details
    } catch (error) {
        console.error('Error fetching location details:', error);
        throw error; 
    }
};

// create a new location
export const createLocation = async (locationData) => {
    if (!locationData) {
        throw new Error('Location data is required to create a new location.');
    }

    console.log('Creating new location with data:', locationData); 
    try {
        const url = `${Constants.DATA_ENDPOINT}locations`;
        console.log(`Sending POST request to: ${url}`); 

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData), 
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error(`Error creating location, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to create location');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the created location data
    } catch (error) {
        console.error('Error creating location:', error);
        throw error; 
    }
};

// edit an existing location
export const updateLocation = async (locationId, locationData) => {
    if (!locationId || !locationData) {
        throw new Error('Location ID and data are required to edit a location.');
    }

    console.log(`Editing location with ID: ${locationId}`, locationData);
    try {
        const url = `${Constants.DATA_ENDPOINT}locations/${locationId}`;
        console.log(`Sending PUT request to: ${url}`);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locationData), 
        });

        if (!response.ok) {
            const errorText = await response.text(); // capture response text for detailed error
            console.error(`Error editing location with ID ${locationId}, status: ${response.status}, error: ${errorText}`);
            throw new Error('Failed to edit location');
        }

        const responseData = await response.json(); // parse response as JSON
        return responseData; // return the updated location data
    } catch (error) {
        console.error('Error editing location:', error);
        throw error; 
    }
};


/**
 * Sends a request to get number of vehicles still available at a select date
 *
 * @async
 * @param {*} date
 * @returns {unknown}
 */
export const fetchNumVehicles = async (date) => {
    let ipData = null;
    try {
        // Convert the date to ISO string (or another desired format)
        const formattedDate = new Date(date).toISOString().split('T')[0]; // Get only the 'yyyy-MM-dd' part
        const endpoint = Constants.DATA_ENDPOINT + "Vehicles/num-on-date/" + encodeURIComponent(formattedDate); // Use query param
        
        console.log("End points sent is " + endpoint + " date is: " + formattedDate);

        const ipResponse = await fetch(endpoint);
        
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch from endpoint ' + endpoint);
        }

        ipData = await ipResponse.json();
        console.log("Fetch Method. Data is " + JSON.stringify(ipData));
        
    } catch (error) {
        console.error('Error fetching from endpoint:', error.message);
    }
    return ipData;
};


export const deleteRouteByDate = async (date) => {
    console.log("In delete by date API function. Incoming date is: " + JSON.stringify(date));
    let result = null;
    try {
        // Create a Date object from the incoming string
        const dateObj = new Date(date);

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date provided');
        }

        // Format the date as 'yyyy-MM-dd' string
        const formattedDate = dateObj.getFullYear() + '-' +
            String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
            String(dateObj.getDate()).padStart(2, '0');
        
        // Construct the DELETE endpoint URL with the formatted date
        const endpoint = `${Constants.DATA_ENDPOINT}DeliveryRoutes/date/${encodeURIComponent(formattedDate)}`;
        
        console.log("Sending DELETE request to: " + endpoint + " with date: " + formattedDate);
        
        // Send the DELETE request to the API
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Failed to delete route for date ' + formattedDate);
        }

        // Parse the JSON response
        result = await response.json();
        console.log("DELETE request successful. Response: " + JSON.stringify(result));
        
    } catch (error) {
        console.error('Error in DELETE request:', error.message);
    }

    return result;
};


/**
 * Sends a request to change the user's password
 *
 * @async
 * @param {string} username - The username of the account
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The new password the user wants to set
 * @returns {string|null} - Returns success message or null in case of failure
 */
export const changePassword = async (username, oldPassword, newPassword) => {
    const response = await fetch('https://routingdata.azurewebsites.net/api/accounts/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Username: username,
            CurrentPassword: oldPassword,
            NewPassword: newPassword
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to change password: ${errorText}`);
    }

    return await response.text();  // Return success message as plain text
};


export const deleteOrder = async (id) => {
    try {
        const response = await fetch(`${Constants.DATA_ENDPOINT}orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete order with ID: ' + id);
        }
        // confirm successful deletion
        const responseData = await response.json();
        console.log('Successfully deleted order with ID:', id);
        return responseData;

    } catch (error) {
        console.error('Error deleting data with ID:', id, " ", error.message);
        return null;
    }
};

// apiFunctions.js
export const reactivateAccount = async (accountId) => {
    const response = await fetch(`${Constants.DATA_ENDPOINT}accounts/reactivate/${accountId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if needed
        },
    });
    if (!response.ok) {
        throw new Error('Failed to reactivate account');
    }
    return response.json();
};

export const fetchAccounts = async () => {
    let driverData = null
    try {
        const driverResponse = await fetch( Constants.DATA_ENDPOINT + 'accounts');
        if (!driverResponse.ok) {
            throw new Error('Failed to fetch accounts.');
        }
        driverData = await driverResponse.json();
    } catch (error) {
        console.error('Error fetching accounts:', error.message);
    }
    return driverData;
};

export const fetchVehicles = async () => {
    let vehicleData = null
    try {
        const vehicleResponse = await fetch( Constants.DATA_ENDPOINT + 'vehicles');
        if (!vehicleResponse.ok) {
            throw new Error('Failed to fetch vehicles.');
        }
        vehicleData = await vehicleResponse.json();
    } catch (error) {
        console.error('Error fetching vehicles:', error.message);
    }
    return vehicleData;
};

///Input is: const input = {
//    {
//        "routeID": 0,
//        "driverUsername": "string",
//        "vehicleID": "string"
//      }
export const updateRouteDetails = async (input) => {
    console.log("SENDING INPUT: ", JSON.stringify(input));
    const response = await fetch(`${Constants.DATA_ENDPOINT}deliveryroutes/${input.routeID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    // Check if the response is not OK
    if (!response.ok) {
        const errorText = await response.text(); // Get the error message from the response body
        return `Error: ${errorText}`;
    } else {
        return "Route details successfully updated";  // Return success message if request was OK
    }
}



