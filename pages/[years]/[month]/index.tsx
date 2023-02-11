import {useRouter} from 'next/router';
import {doc, getDoc, setDoc} from "@firebase/firestore";
import {firestore, mergeWithId} from "../../../lib/firebase";
import {useState, useEffect, useContext} from "react";
import MoneyPot from "../../../components/MoneyPot/MoneyPot";
import {UserContext} from "../../../lib/context";
import {getCurrentYearAsString} from "../../../lib/services";
import Pot from "../../../models/Pot";

export default function AdminMoneyPotPage({}) {
    const {user} = useContext(UserContext);
    const [pot, setPot] = useState(null);

    const router = useRouter();
    const {month} = router.query;
    const monthId: string = Array.isArray(month) ? month[0] : month;


    if (user && month !== undefined) {
        (async () => {
            const potRef = doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months', monthId, 'pot', monthId);
            let docSnap = await getDoc(potRef);
            if (!docSnap.exists()) {
                await setDoc(potRef, {id: monthId, name: 'A Pot', goal: 20000} as Pot); //TODO: if pot does not exist, show form to enter pot informations
                docSnap = await getDoc(potRef);
            }
            setPot(mergeWithId(docSnap));
        })();
    }


    return (
        <>
            {pot && <MoneyPot monthId={monthId} pot={pot} key={monthId}/>}
        </>
    )
}