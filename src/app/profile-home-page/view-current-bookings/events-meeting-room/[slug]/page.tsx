import UserCurrentEventMeetingBookingPage from "@/components/Profile Page Component/User Current Booking Page Component/UserCurrentEventMeetingBookingPage";

export function generateMetadata(){
    return {
        title: 'View Current Event Meeting Booking'
    }
}


export default function Page(){
    return (
        <div>
            <UserCurrentEventMeetingBookingPage />
        </div>
    );
}