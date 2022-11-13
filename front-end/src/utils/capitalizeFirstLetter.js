export default function capitalizeFirstLetter(string) {
    if (!string) return null;
    string[0] = string[0].toUpperCase();
    return string;
}