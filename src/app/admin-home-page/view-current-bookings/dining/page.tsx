import CurrentDiningBookingPage from "@/components/Admin Page Component/Current Booking Page Component/CurrentDiningBookingPage";


export function generateMetadata(){
    return {
        title: 'View Current Dining Booking'
    }
}


export default function Page(){
    return (
        <div>
            <CurrentDiningBookingPage />
        </div>
    );
}