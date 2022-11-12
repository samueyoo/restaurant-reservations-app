export default function validateDateIsBefore(date) {
    const day = new Date(date.replace(/-/g, '\/'));
    //console.log(day);
    //console.log("day", day.getDay());
    const dayNow = new Date();
    const errors = [];
    if (day.getDay() === 2) {
        console.log("No Tuesdays allowed");
        errors.push("Restaurant is not open on Tuesdays")
    }
    if (day.getTime() < dayNow.getTime()) {
        console.log("Reservation can't be before today");
        errors.push("Reservation cannot be in the past");
    }
    return errors;
}