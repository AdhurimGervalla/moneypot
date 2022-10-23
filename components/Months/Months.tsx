import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../lib/context"
import { collection, getDocs } from "firebase/firestore"; 
import { buildListFromFirestoreDocs, firestore, getCollection, getCollectionById, mergeWithId } from "../../lib/firebase";
import Loader from "../Loader/Loader";
import Month from "../Month/Month";
import {Month as MonthModel} from "../../models/Month";
import { getCurrentYearAsString } from "../../lib/services";

export default function Months() {

    // TODO: Alle Monate als Liste darstellen
    // TODO: Jeder Monat enthält einen Pot
    // TODO: Bei klick auf einen Monat kommt zum monatlichen Pot
    // TODO: [Pony] Pro Monat kann das Pot Layout geändert werden
    const { user } = useContext(UserContext);
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const collectionRef = collection(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months');
            await getCollection(collectionRef, setMonths, 'sorting');
            setLoading(false);
        })();
    }, []);

    return(
        <>
        {loading ? <Loader show /> : 
            months.map((el) => <Month key={el.id} month={el} />)}
        </>
    )
}

