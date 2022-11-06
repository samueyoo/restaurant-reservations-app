/*
* Checks if the form input for the date is in the correct format to be parsed by the backend
* Returns an array of error message strings
*/

export default function checkDate(dateString) {
    const checkSlash = dateString.split('');
    console.log('Currently in checkDate()... checking separator', checkSlash)
    const returnMsg = [];
    let separator;
    if (checkSlash.includes('/')) {
        separator = '/'
    } else if (checkSlash.includes('-')) {
        separator = '-'
    };

    if (separator) {
        const dateArray = dateString.split(separator);
        console.log('Still in checkDate()... checking format', dateArray)
        switch (false) {
            case ((Number(dateArray[0]) >= 1 && Number(dateArray[0]) <= 12)):
                returnMsg.push('Invalid month');
            case ((Number(dateArray[1]) >= 1 && Number(dateArray[1]) <= 31)): 
                returnMsg.push('Invalid day');
            case ((Number(dateArray[2]) >= new Date().getFullYear())):
                returnMsg.push('Year cannot be before current year');
            case (dateArray[2].length === 4):
                returnMsg.push('Year must be in YYYY format');
        }
    } else {
        returnMsg.push('Must be in MM/DD/YYYY or MM-DD-YYYY format');
    }
    return returnMsg;
}