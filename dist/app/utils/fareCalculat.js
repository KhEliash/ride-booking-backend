"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = calculateFare;
function calculateFare(pickup, destination) {
    if (!pickup ||
        !destination ||
        typeof pickup.lat !== "number" ||
        typeof pickup.lng !== "number" ||
        typeof destination.lat !== "number" ||
        typeof destination.lng !== "number") {
        console.warn("Invalid coordinates, cannot calculate fare.");
        return 0;
    }
    //   console.log("Calculating fare for:");
    //   console.log("Pickup:", pickup);
    //   console.log("Destination:", destination);
    const R = 6371; // Radius of Earth in km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(destination.lat - pickup.lat);
    const dLng = toRad(destination.lng - pickup.lng);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(pickup.lat)) *
            Math.cos(toRad(destination.lat)) *
            Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const baseFare = 50; // base fare in your currency
    const perKmRate = 20; // rate per kilometer
    const fare = baseFare + distance * perKmRate;
    //   console.log(`Distance: ${distance.toFixed(2)} km, Fare: ${fare.toFixed(2)}`);
    return Math.round(fare);
}
