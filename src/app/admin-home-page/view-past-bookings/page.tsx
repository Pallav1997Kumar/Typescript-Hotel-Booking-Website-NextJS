import PastAllBookingPage from "@/components/Admin Page Component/Past Booking Page Component/PastAllBookingPage";


export function generateMetadata(){
    return {
        title: 'View Past Booking'
    }   
}


export default function Page(){
    return (
        <div>
            <PastAllBookingPage />
        </div>
    );
}