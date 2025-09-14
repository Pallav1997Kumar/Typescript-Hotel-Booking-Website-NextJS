import EventMeetingProceedPage from '@/components/Procced Booking Component/Page Component/EventMeetingProceedPage';

export function generateMetadata(){
    return {
        title: 'Proceed Booking - Events Meeting Rooms'
    }
}

export default function Page(){
    return (
        <div>
            <EventMeetingProceedPage />
        </div>
    );
}