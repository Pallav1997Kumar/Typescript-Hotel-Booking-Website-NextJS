import Register from "@/components/Authentication Component/Register";


export function generateMetadata(){
    return {
        title: 'Royal Palace - Register'
    }
}


export default function Page(){
    return(
        <div>
            <Register />
        </div>
    );
}