import UserAllCartComponentPage from "@/components/Profile Page Component/User Cart Page Component/UserAllCartComponentPage";


export function generateMetadata(){
    return {
        title: 'My Account Cart'
    }
}


export default function Page(){
    return (
        <div>
            <UserAllCartComponentPage />
        </div>
    );
}