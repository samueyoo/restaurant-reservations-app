export default function validateTime(timeInput) {
    const errors = [];
    if (timeInput < "10:30") {
        console.log("validateTime; Time cannot be before 10:30 AM");
        errors.push("Time cannot be before 10:30 AM")
    }
    if (timeInput > "21:30") {
        console.log("validateTime; Time cannot be after 9:30 PM");
        errors.push("Time cannot be after 9:30 PM");
    }

    if (errors.length > 0) {
        const errorMessages = errors.join("; ");
        console.log(errorMessages);
        return { message: errorMessages}

    }
    return null;
}