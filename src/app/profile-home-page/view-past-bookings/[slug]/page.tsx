import UserPastAllBookingPage from "@/components/Profile Page Component/User Past Booking Page Component/UserPastAllBookingPage";

export function generateMetadata(){
    return {
        title: 'View Past Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserPastAllBookingPage />
        </div>
    );
}