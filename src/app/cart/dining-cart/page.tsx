import DiningCartComponent from "@/components/Cart Page Component/DiningCartComponent";


export function generateMetadata(){
    return {
        title: 'Dining Carts'
    }
}


export default function Page(){
    return (
        <div>
            <DiningCartComponent />
        </div>
    );
}