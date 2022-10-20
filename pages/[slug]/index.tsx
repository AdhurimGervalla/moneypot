import AuthCheck from "../../components/AuthCheck/AuthCheck";
import MoneyPotList from "../../components/MoneyPot/MoneyPotList";
import { SignOutButton } from "../login";
import { useRouter } from 'next/router';
import { doc, getDoc } from "firebase/firestore";
import { firestore, getDocById, mergeWithId } from "../../lib/firebase";
import { useState, useEffect, useContext } from "react";
import MoneyPot from "../../components/MoneyPot/MoneyPot";
import { UserContext } from "../../lib/context";

export default function AdminMoneyPotPage({  }) {
    const { user } = useContext(UserContext);
    const [pot, setPot] = useState(null);

    const router = useRouter();
    const { slug } = router.query;
    const potId: string = Array.isArray(slug) ? slug[0] : slug;

    
    useEffect(() => {
        if (user && slug !== undefined) {
            (async () => {
                const docSnap = await getDocById('moneypot', potId);
                setPot(mergeWithId(docSnap));
            })();
        }
    }, []);
    

    return(
        <>
            {pot && <MoneyPot pot={pot} key={potId} />}
        </>
    )
}