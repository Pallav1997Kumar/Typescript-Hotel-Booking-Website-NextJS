import PastRoomsSuitesBookingPage from "@/components/Admin Page Component/Past Booking Page Component/PastRoomsSuitesBookingPage";


export function generateMetadata(){
    return {
        title: 'View Past Rooms and Suites Booking'
    }   
}


export default function Page(){
    return (
        <div>
            <PastRoomsSuitesBookingPage />
        </div>
    );
}