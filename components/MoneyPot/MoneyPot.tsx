import { useEffect, useState } from "react";
import { Layout } from "../../models/Types";
import IncomeItem from "../IncomeItem/IncomeItem";
import InputField from "./InputField";
import { getStoredArrayFromSession, saveArrayToSession } from "../../lib/services";
import { Income } from "../../models/Income";
import Expenditures from "../../models/Expenditures";


export default function MoneyPot( { pot }) {

    const [incomes, setIncomes] = useState([]);
    const [expenditures, setExpenditures] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [total, setTotal] = useState(0);

    const calculateTotal = (): void => {
        let tempTotal = 0;
        incomes.forEach((object: Income) => tempTotal += object.value);
        expenditures.forEach((object: Expenditures) => tempTotal -= object.value);
        setTotal(tempTotal);
    };

    useEffect(() => {
        setIncomes(getStoredArrayFromSession('IncomeList'));
        setExpenditures(getStoredArrayFromSession('ExpenditureList'));
        calculateTotal();
        setDirty(false);
    }, [dirty]);

    const deleteTrigger = (objectToRemove: {}, layout: Layout) => {
        let filtered = [];
        if (layout === Layout.Expenditure) {
            filtered = expenditures.filter((el) => el !== objectToRemove);
            saveArrayToSession(filtered, 'ExpenditureList');
            
        } else {
            filtered = incomes.filter((el) => el !== objectToRemove);
            saveArrayToSession(filtered, 'IncomeList');
        }
        setDirty(true);
    }

    return(
        <div>
            <h1 className="text-5xl">{pot.name}</h1>
            {pot &&
                <div className="grid grid-flow-col grid-cols-3">
                    <div>
                        <h4 className="text-xl">Einnahmen</h4>
                        {incomes && 
                            incomes.map(income => <IncomeItem layout={Layout.Income} key={income.id} deleteTrigger={deleteTrigger} data={income} />)}
                    </div>
                    <div className="text-center">
                        <InputField key={pot.id} dirtyState={[dirty, setDirty]} totalState={[total, setTotal]} />
                        <h1 className="text-5xl mt-12">{total}</h1>
                    </div>
                    <div>
                        <h4 className="text-xl">Ausgaben</h4>
                        {expenditures && 
                            expenditures.map(expenditure => <IncomeItem layout={Layout.Expenditure} deleteTrigger={deleteTrigger} key={expenditure.id}  data={expenditure} />)}
                    </div>
                </div>
            }

        </div>
    );
    
}