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
        const ipResponse = await fetch('https://routingdata.azurewebsites.net/api/customers');
        if (!ipResponse.ok) {
            throw new Error('Failed to fetch IP address');
        }
        ipData = await ipResponse.json();
        console.log("Data is " + JSON.stringify(ipData) );
        // Use user's IP address to fetch region information
    } catch (error) {
        console.error('Error fetching region:', error.message);
    }
    return ipData
};

