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
  