import UserRoomsSuitesCartPageComponent from "@/components/Profile Page Component/User Cart Page Component/UserRoomsSuitesCartPageComponent";


export function generateMetadata(){
    return {
        title: 'Account Rooms and Suites Cart'
    }
}


export default function Page(){
    return (
        <div>
            <UserRoomsSuitesCartPageComponent />
        </div>
    );
}