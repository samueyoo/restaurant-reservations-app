export default function validateDateIsBefore(date) {
    const day = new Date(date.replace(/-/g, '\/'));
    //console.log(day);
    const dayNow = new Date();
    const errors = [];
    if (day.getDay() === 2) {
        errors.push("Restaurant is not open on Tuesdays")
    }
    if (day.getTime() < dayNow.getTime()) {
        errors.push("Reservation cannot be in the past");
    }

    if (errors.length > 0) {
        const errorMessages = errors.join("; ");
        return { message: errorMessages };
    }
    return null;
}