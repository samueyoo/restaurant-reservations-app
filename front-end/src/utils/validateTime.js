export default function validateTime(timeInput) {
    const errors = [];
    if (timeInput < "10:30") {
        errors.push("Time cannot be before 10:30 AM")
    }
    if (timeInput > "21:30") {
        errors.push("Time cannot be after 9:30 PM");
    }

    if (errors.length > 0) {
        const errorMessages = errors.join("; ");
        return { message: errorMessages}

    }
    return null;
}