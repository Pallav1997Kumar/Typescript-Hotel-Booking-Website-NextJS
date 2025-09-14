import HotelEventMeetingRoomBookingInfo from "@/database models/booking models/events meetings models/hotelEventMeetingRoomBookingInfo";


async function unlockExpiredEventMeetingLocks() {
    const FIVE_MINUTES_AGO: Date = new Date(Date.now() - 5 * 60 * 1000);

    try {
        await HotelEventMeetingRoomBookingInfo.updateMany(
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
        console.error("Error unlocking expired event meeting locks:", error);
        throw error;
    }
}

export default unlockExpiredEventMeetingLocks;