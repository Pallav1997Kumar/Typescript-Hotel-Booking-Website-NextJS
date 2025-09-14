import CurrentRoomsSuitesBookingPage from "@/components/Admin Page Component/Current Booking Page Component/CurrentRoomsSuitesBookingPage";


export function generateMetadata(){
    return {
        title: 'View Current Rooms Suites Booking'
    }
}


export default function Page(){
    return (
        <div>
            <CurrentRoomsSuitesBookingPage />
        </div>
    );
}