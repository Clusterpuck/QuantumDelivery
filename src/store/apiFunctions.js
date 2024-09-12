import * as Constants from '../Constants.js';

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
        console.log("Fetch Method. Data is " + JSON.stringify(ipData) );
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
export const updateOrderStatus = async(input) =>{
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

