import {useContext, useEffect, useRef, useState} from "react"
import {UserContext} from "../../lib/context"
import {collection, doc, setDoc} from "@firebase/firestore";
import {firestore, getCollection, saveDoc} from "../../lib/firebase";
import Loader from "../Loader/Loader";
import Month from "../Month/Month";
import {Month as MonthModel} from "../../models/Month"
import {getCurrentMonthAsString, getCurrentYearAsString, getMonthName} from "../../lib/services";
import toast from 'react-hot-toast';

export default function Months() {

    // TODO: [Pony] Pro Monat kann das Pot Layout geändert werden
    const {user} = useContext(UserContext);
    const [months, setMonths] = useState<MonthModel[]>(undefined);

    /**
     * checks if the current month was not generated until now
     */
    const newMonthInitialCall = (): boolean => months.findIndex((month) => month.id === getCurrentMonthAsString()) === -1;

    useEffect(() => {
        (async () => {
            const collectionRef = collection(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months');
            await getCollection<MonthModel[]>(collectionRef, setMonths, 'sorting');
        })();
    }, []);

    useEffect(() => {
        if (months === undefined) return;
        if (newMonthInitialCall) {
            (async () => {
                try {
                    const currentMonth: string = getCurrentMonthAsString();
                    const nextMonth: MonthModel = {
                        id: currentMonth,
                        name: getMonthName(parseInt(getCurrentMonthAsString())),
                        sorting: parseInt(getCurrentMonthAsString())
                    };
                    await saveDoc<MonthModel>(doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months', currentMonth), nextMonth);
                } catch (e) {
                    console.error("Auto generation of new month failed");
                    toast.error("Auto generation of new month failed");
                }

            })();
        }
    }, [months]);

    return (
        <>
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {months && months.map((el) => <Month key={el.id} month={el}/>)}            
            </ul>
        </>
        
    )
}

