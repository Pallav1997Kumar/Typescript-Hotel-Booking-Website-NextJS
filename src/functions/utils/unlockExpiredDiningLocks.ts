import HotelDiningTableBookingInfo from "@/database models/booking models/dining models/hotelDiningTableBookingInfo";


async function unlockExpiredDiningLocks() {
    const FIVE_MINUTES_AGO: Date = new Date(Date.now() - 5 * 60 * 1000);

    try {
        await HotelDiningTableBookingInfo.updateMany(
        {
            isBookingLocked: true,
            lockedAt: { $lte: FIVE_MINUTES_AGO },
        },
        {
            $set: { isBookingLocked: false, lockedAt: null },
        }
        );
    } 
    catch (error) {
        console.error("Error unlocking expired dining locks:", error);
        throw error;
    }
}

export default unlockExpiredDiningLocks;