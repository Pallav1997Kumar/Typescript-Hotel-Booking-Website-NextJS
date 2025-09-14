import UpdatePersonalInformation from "@/components/Profile Page Component/Update Profile Details Component/UpdatePersonalInformation";


export function generateMetadata(){
    return {
        title: 'Edit Profile'
    }
}


export default function Page(){
    return (
        <div>
            <UpdatePersonalInformation />
        </div>
    );
}