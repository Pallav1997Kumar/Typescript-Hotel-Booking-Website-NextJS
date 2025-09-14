import AllCartsComponent from "@/components/Cart Page Component/AllCartsComponent";


export function generateMetadata(){
    return {
        title: 'My Carts'
    }
}


export default function Page(){
    return (
        <div>
            <AllCartsComponent />
        </div>
    );
}