import { collection, doc, getDocs } from "firebase/firestore"; 
import { useEffect, useState } from "react";
import { buildListFromFirestoreDocs, firestore, mergeWithId } from "../../lib/firebase";
import { Income } from "../../models/Income";
import ExpenditureItem from "../ExpenditureItem/ExpenditureItem";
import IncomeItem from "../IncomeItem/IncomeItem";


export default function MoneyPot( { pot }) {

    const [incomes, setIncomes] = useState([]);
    const [expenditures, setExpenditures] = useState([]);

    useEffect(()=> {
        const incomeRef = collection(firestore, 'moneypot', pot.id, 'income');
        const expenditureRef = collection(firestore, 'moneypot', pot.id, 'expenditure');
        (async () => {
            const qSnap = await getDocs(incomeRef);
            const qSnapExpenditures = await getDocs(expenditureRef);
            setIncomes(buildListFromFirestoreDocs<Income>(qSnap, mergeWithId));
            setExpenditures(buildListFromFirestoreDocs<Income>(qSnapExpenditures, mergeWithId))
        })();

    }, [])

    return(
        <main>
            <h1>{pot.name}</h1>
            <div>
                <h1 className="text-3xl font-bold underline">
                    Hello world!
                </h1>
                {incomes && 
                    incomes.map(income => <IncomeItem key={income.id} incomeItem={income} />)}
            </div>
            
            <div>
                <h4>Ausgaben</h4>
                {expenditures && 
                    expenditures.map(expenditure => <ExpenditureItem key={expenditure.id} item={expenditure} />)}
            </div>
        </main>
    );
    
}