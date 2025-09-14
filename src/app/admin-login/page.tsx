import AdminLogin from "@/components/Authentication Component/AdminLogin";


export function generateMetadata(){
    return {
        title: 'Royal Palace- Admin Login'
    }
}


export default function Page(){
    return(
        <div>
            <AdminLogin />
        </div>
    );
}