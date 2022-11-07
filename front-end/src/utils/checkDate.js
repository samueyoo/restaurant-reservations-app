/*
* Validates if the form input for the date is in the correct format to be parsed by the backend
    * Date and time should be in the correct format
    * Date should not be BEFORE current date
* Returns an array of error message strings
*/

export default function checkDate(dateString) {
    const checkSlash = dateString.split('');
    console.log('Currently in checkDate()... checking separator', checkSlash)
    const returnMsg = [];
    //Can remove code checking for separator since date format is now enforced by form
    let separator = '-';
    // if (checkSlash.includes('/')) {
    //     separator = '/'
    // } else if (checkSlash.includes('-')) {
    //     separator = '-'
    // };

    //if (separator) {
        const dateArray = dateString.split(separator);
        const today = new Date();
        console.log('checkDate... today:', today.getFullYear(), today.getMonth() + 1, today.getDate())
        console.log('Still in checkDate()... checking format', dateArray)

        //Check if month value is between 1-12
        if (Number(dateArray[1]) < 1 || Number(dateArray[1]) > 12) {
            returnMsg.push('Invalid month');
        }
        //If reservation year is same as current year, check if month is before current month
        if (Number(dateArray[1]) < today.getMonth() + 1) {
            if (Number(dateArray[0]) === today.getFullYear()) {
                returnMsg.push('Month cannot be before current month');
            };
        }
        //Check if day is between 1-31
        if (Number(dateArray[2]) < 1 || Number(dateArray[2]) > 31) {
            //console.log('About to push Invalid Day', Number(dateArray[2]))
            //console.log('Between?', (Number(dateArray[2]) >= 1 && Number(dateArray[2]) <= 31))
            returnMsg.push('Invalid day');
        }
        //If reservation month & year is same as current month/year, check if day is before current day
        if (Number(dateArray[2]) < today.getDate()) {
            //console.log('Date is prior to current date, checking mo/yr next', dateArray[2], today.getDate())
            if (Number(dateArray[0]) === today.getFullYear() && Number(dateArray[1]) === today.getMonth() + 1) {
                returnMsg.push('Day cannot be before current day');
            }
        }
        //Check if year is before current year
        if (Number(dateArray[0]) < today.getFullYear()) { //Add validation for reservations accidentally more than 10 years out?
            returnMsg.push('Year cannot be before current year');
        } 
        //Check if year is in YYYY format
        if (dateArray[0].length !== 4) {
            returnMsg.push('Year must be in YYYY format');
        }
    //}
    return returnMsg;
}