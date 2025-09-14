import UserCurrentAllBookingPage from "@/components/Profile Page Component/User Current Booking Page Component/UserCurrentAllBookingPage";

export function generateMetadata(){
    return {
        title: 'View Current Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserCurrentAllBookingPage />
        </div>
    );
}