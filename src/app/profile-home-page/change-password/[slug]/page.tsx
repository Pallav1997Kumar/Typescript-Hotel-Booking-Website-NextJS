import ChangePassword from "@/components/Profile Page Component/Update Profile Details Component/ChangePassword";


export function generateMetadata(){
    return {
        title: 'Change Password'
    }
}


export default function Page(){
    return (
        <div>
            <ChangePassword />
        </div>
    );
}