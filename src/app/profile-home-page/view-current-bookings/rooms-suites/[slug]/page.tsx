import UserCurrentRoomsSuitesBookingPage from "@/components/Profile Page Component/User Current Booking Page Component/UserCurrentRoomsSuitesBookingPage";

export function generateMetadata(){
    return {
        title: 'View Current Rooms Suites Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserCurrentRoomsSuitesBookingPage />
        </div>
    );
}