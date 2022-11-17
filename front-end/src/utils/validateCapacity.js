import axios from "axios";

export default async function validateCapacity(baseURL, reservationId, capacity) {

    return await axios.get(`${baseURL}/reservations/${reservationId}`)
        .then(res => {
            // console.log(res.data);
            // console.log("Currently in validateCapacity...");
            // console.log("Reservation # of people:", res.data.data.people)
            // console.log("Table capacity:", capacity)
            if (Number(res.data.data.people) > Number(capacity)) {
                throw new Error("Party size cannot exceed table capacity");
            }
            return res;
        })
        .catch(error => {
            return error;
        })
}