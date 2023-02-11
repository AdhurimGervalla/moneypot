import {useContext, useEffect, useState} from "react"
import {UserContext} from "../../lib/context"
import {collection, doc, setDoc} from "@firebase/firestore";
import {firestore, getCollection, getCollectionTwo, saveDoc} from "../../lib/firebase";
import Loader from "../Loader/Loader";
import Month from "../Month/Month";
import {Month as MonthModel} from "../../models/Month"
import {getCurrentMonthAsString, getCurrentYearAsString, getMonthName} from "../../lib/services";
import toast from 'react-hot-toast';

export default function Months() {

    // TODO: [Pony] Pro Monat kann das Pot Layout geändert werden
    const {user} = useContext(UserContext);
    const [months, setMonth] = useState<MonthModel[]>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const collectionRef = collection(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months');
            await getCollection<MonthModel[]>(collectionRef, setMonth, 'sorting');
        })();
    }, []);

    useEffect(() => {
        if (months === undefined) return;
        setLoading(false);
        const currentMonth = getCurrentMonthAsString();
        if (months.findIndex((month) => month.id === currentMonth) === -1) {
            const ref = doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months', currentMonth);
            (async () => {
                try {
                    await saveDoc<MonthModel>(ref, {id: currentMonth, name: getMonthName(parseInt(currentMonth)), sorting: parseInt(currentMonth)});
                    console.log('auto generated new month');
                } catch (e) {
                    console.error("Auto generation of new month failed");
                    toast.error("Auto generation of new month failed");
                }

            })();
        }
    }, [months]);

    return (
        <div className="grid grid-cols-6 gap-4">
            {loading ? <Loader show/> :
                months.map((el) => <Month key={el.id} month={el}/>)}
        </div>
    )
}

