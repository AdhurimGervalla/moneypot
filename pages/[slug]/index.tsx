import AuthCheck from "../../components/AuthCheck/AuthCheck";
import MoneyPotList from "../../components/MoneyPot/MoneyPotList";
import { SignOutButton } from "../login";
import { useRouter } from 'next/router';
import { doc, getDoc } from "firebase/firestore";
import { firestore, mergeWithId } from "../../lib/firebase";
import { useState, useEffect } from "react";
import MoneyPot from "../../components/MoneyPot/MoneyPot";

export default function AdminMoneyPotPage({  }) {
    const [pot, setPot] = useState(null);

    const router = useRouter();
    const { slug } = router.query;
    const potId: string = Array.isArray(slug) ? slug[0] : slug;

    
    useEffect(() => {
        if (slug !== undefined) {
            (async () => {
                const docRef = doc(firestore, "moneypot", potId);
                const docSnap = await getDoc(docRef);
                setPot(mergeWithId(docSnap));
            })();
        }
    }, []);
    

    return(
        <AuthCheck>
            <main>
                {pot && <MoneyPot pot={pot} />}
            </main>
        </AuthCheck>
    )
}