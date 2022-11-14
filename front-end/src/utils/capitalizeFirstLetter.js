export default function capitalizeFirstLetter(string) {
    if (!string) return null;
    return string[0].toUpperCase() + string.slice(1);
}