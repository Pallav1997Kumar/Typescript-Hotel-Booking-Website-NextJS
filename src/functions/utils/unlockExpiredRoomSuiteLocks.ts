// utils/unlockExpiredRoomSuiteLocks.js
import HotelRoomSuiteBookingInfo from "@/database models/booking models/room suites models/hotelRoomSuiteBookingInfo";


async function unlockExpiredRoomSuiteLocks() {
    const FIVE_MINUTES_AGO: Date = new Date(Date.now() - 5 * 60 * 1000);

    await HotelRoomSuiteBookingInfo.updateMany(
        {
            isBookingLocked: true,
            lockedAt: { $lte: FIVE_MINUTES_AGO },
        },
        {
            $set: { isBookingLocked: false, lockedAt: null },
        }
    );
}

export default unlockExpiredRoomSuiteLocks;
