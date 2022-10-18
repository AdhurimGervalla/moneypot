import { collection, doc, getDocs, onSnapshot, query, Unsubscribe, where } from "firebase/firestore"; 
import { useEffect, useState } from "react";
import { firestore, getSnapshotFromCollection, mergeWithId, removeDoc } from "../../lib/firebase";
import Expenditures from "../../models/Expenditures";
import { Income } from "../../models/Income";
import ExpenditureItem from "../ExpenditureItem/ExpenditureItem";
import IncomeItem from "../IncomeItem/IncomeItem";
import InputField from "./InputField";


export default function MoneyPot( { pot }) {

    const [incomes, setIncomes] = useState([]);
    const [expenditures, setExpenditures] = useState([]);

    const staticIncomeRef = collection(firestore, 'moneypot', pot.id, 'income');
    const unsubscribe: Unsubscribe = getSnapshotFromCollection<Income>(staticIncomeRef, setIncomes)

    const staticExpenditureRef = collection(firestore, 'moneypot', pot.id, 'expenditure');
    const unsubscribeExp: Unsubscribe = getSnapshotFromCollection<Expenditures>(staticExpenditureRef, setExpenditures)
    const deleteTrigger = async (collectionName: string, itemId: string) => {
        const docRef = doc(firestore, 'moneypot', pot.id, collectionName, itemId )
        removeDoc(docRef);
    }

    return(
        <div>
            <h1 className="text-5xl">{pot.name}</h1>
            {pot &&
                <div className="grid grid-flow-col grid-cols-3">
                    <div>
                        <h2 className="text-3xl">
                            Pot VIew
                        </h2>
                        {incomes && 
                            incomes.map(income => <IncomeItem key={income.id} deleteTrigger={deleteTrigger} incomeItem={income} />)}
                    </div>
                    <div className="text-center"><InputField incomeRef={staticIncomeRef} expenditureRef={staticExpenditureRef} /></div>
                    <div>
                        <h4>Ausgaben</h4>
                        {expenditures && 
                            expenditures.map(expenditure => <ExpenditureItem deleteTrigger={deleteTrigger} key={expenditure.id}  item={expenditure} />)}
                    </div>
                </div>
            }

        </div>
    );
    
}