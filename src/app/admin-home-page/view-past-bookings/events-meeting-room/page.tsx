import PastEventMeetingBookingPage from "@/components/Admin Page Component/Past Booking Page Component/PastEventMeetingBookingPage";


export function generateMetadata(){
    return {
        title: 'View Past Event and Meeting Rooms Booking'
    }   
}


export default function Page(){
    return (
        <div>
            <PastEventMeetingBookingPage />
        </div>
    );
}