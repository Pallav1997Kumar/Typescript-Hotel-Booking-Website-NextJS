import UserEventMeetingCartPageComponent from "@/components/Profile Page Component/User Cart Page Component/UserEventMeetingCartPageComponent";


export function generateMetadata(){
    return {
        title: 'Account Event and Meeting Room Cart'
    }
}


export default function Page(){
    return (
        <div>
            <UserEventMeetingCartPageComponent />
        </div>
    );
}