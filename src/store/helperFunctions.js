import '../assets/Marker.css';
 
 // Function to format the date
 export function formatDate(isoDate) {
    //console.log("xxXX Date sent is ", isoDate)
    try {
      const date = new Date(isoDate);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
      return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date'; // Fallback in case of error
    }
  }

  export function getStatusColour(order) {
    // Check the order's status and delayed attributes to return the appropriate color
    if (order.status === 'DELIVERED') {
        return 'delivered'; // Light green for delivered
    } else if (order.status === 'ISSUE') {
        return 'issue'; // Light red for issue
    } else if (order.delayed) {
        return 'delayed'; // Light pink for delayed
    } else {
        return 'default'; // Light yellow for anything else (on-route, etc.)
    }
};

export function getRowColour (delayed) {
  switch (delayed) {
      case true:
          return '#f8d7da'; // Light red
      default:
          return '#d4edda'; // Light green
  }
};
  