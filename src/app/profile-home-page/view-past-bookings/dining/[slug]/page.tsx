import UserPastDiningBookingPage from "@/components/Profile Page Component/User Past Booking Page Component/UserPastDiningBookingPage";

export function generateMetadata(){
    return {
        title: 'View Past Dining Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserPastDiningBookingPage />
        </div>
    );
}