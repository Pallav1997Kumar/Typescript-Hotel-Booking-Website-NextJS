export const dynamic = 'force-dynamic';

import ViewTransactionHistory from "@/components/Admin Page Component/View Transaction History/ViewTransactionHistory";


export function generateMetadata(){
    return {
        title: 'View Transaction History'
    }   
}


export default function Page(){
    return (
        <div>
            <ViewTransactionHistory />
        </div>
    );
}