import ProfileHomePage from "@/components/Profile Page Component/ProfileHomePage";

export function generateMetadata(){
    return {
        title: 'Profile Page'
    }   
}

export default function Page(){
    return (
        <div>
            <ProfileHomePage />
        </div>
    );
}