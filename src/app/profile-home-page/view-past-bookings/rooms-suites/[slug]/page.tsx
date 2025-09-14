import UserPastRoomsSuitesBookingPage from "@/components/Profile Page Component/User Past Booking Page Component/UserPastRoomsSuitesBookingPage";

export function generateMetadata(){
    return {
        title: 'View Past Rooms Suites Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserPastRoomsSuitesBookingPage />
        </div>
    );
}