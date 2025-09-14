import UserPastEventMeetingBookingPage from "@/components/Profile Page Component/User Past Booking Page Component/UserPastEventMeetingBookingPage";

export function generateMetadata(){
    return {
        title: 'View Past Event Meeting Booking'
    }
}


export default function Page(){
    return (
        <div>
            <UserPastEventMeetingBookingPage />
        </div>
    );
}