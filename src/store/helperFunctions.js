 // Function to format the date
 export function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB'); 
    // For DD/MM/YYYY use 'en-GB'
}