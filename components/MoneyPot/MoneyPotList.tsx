import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../lib/context"
import { collection, doc, query, where, getDocs } from "firebase/firestore"; 
import { firestore, mergeWithId } from "../../lib/firebase";
import Loader from "../Loader/Loader";
import MoneyPotListItem from "./MoneyPotListItem";
import Pot from '../../models/Pot';

export default function MoneyPotList() {
    const { user } = useContext(UserContext);
    const [moneyPotList, setMoneyPotList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const q = query(collection(firestore, "moneypot"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const moneyPotList: Pot[] = querySnapshot?.docs.map((doc) => {
                return mergeWithId(doc);
            });
            setMoneyPotList(moneyPotList);
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

