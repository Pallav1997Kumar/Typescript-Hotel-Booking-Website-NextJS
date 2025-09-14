import RoomsSuitesCartComponent from "@/components/Cart Page Component/RoomsSuitesCartComponent";


export function generateMetadata(){
    return {
        title: 'Rooms and Suites Carts'
    }
}


export default function Page(){
    return (
        <div>
            <RoomsSuitesCartComponent />
        </div>
    );
}