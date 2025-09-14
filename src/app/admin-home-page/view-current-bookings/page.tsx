import CurrentAllBookingPage from "@/components/Admin Page Component/Current Booking Page Component/CurrentAllBookingPage";


export function generateMetadata(){
    return {
        title: 'View Current Booking'
    }
}


export default function Page(){
    return (
        <div>
            <CurrentAllBookingPage />
        </div>
    );
}