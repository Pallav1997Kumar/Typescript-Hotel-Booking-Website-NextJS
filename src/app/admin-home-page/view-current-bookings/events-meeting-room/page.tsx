import CurrentEventMeetingBookingPage from "@/components/Admin Page Component/Current Booking Page Component/CurrentEventMeetingBookingPage";


export function generateMetadata(){
    return {
        title: 'View Current Event Meeting Booking'
    }
}


export default function Page(){
    return (
        <div>
            <CurrentEventMeetingBookingPage />
        </div>
    );
}