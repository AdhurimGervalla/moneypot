import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../lib/context"
import { collection, doc, query, where, getDocs } from "firebase/firestore"; 
import { firestore, mergeWithId, buildListFromFirestoreDocs } from "../../lib/firebase";
import Loader from "../Loader/Loader";
import MoneyPotListItem from "./MoneyPotListItem";
import Pot from '../../models/Pot';

export default function MoneyPotList() {

    // TODO: Alle Monate als Liste darstellen
    // TODO: Jeder Monat enthält einen Pot
    // TODO: Bei klick auf einen Monat kommt zum monatlichen Pot
    const { user } = useContext(UserContext);
    const [moneyPotList, setMoneyPotList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const q = query(collection(firestore, "moneypot"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            setMoneyPotList(buildListFromFirestoreDocs<Pot>(querySnapshot, mergeWithId));
        })();
        setLoading(false);
    }, []);

    return(
        <>
        {loading ? <Loader show /> : 
        moneyPotList.map((el) => <MoneyPotListItem key={el.id} moneyPot={el} />)}
        </>
    )
}

