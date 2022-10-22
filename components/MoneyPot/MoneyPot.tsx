import { useEffect, useState } from "react";
import { Layout } from "../../models/Types";
import IncomeItem from "../Liquid/Liquid";
import InputField from "./InputField";
import { getStoredArrayFromSession, saveArrayToSession } from "../../lib/services";
import { LiquidKind } from "../../models/Liquid";
import Expenditures from "../../models/Expenditures";
import FluidPot from "./FluidPot";
import Liquid from "../Liquid/Liquid";


export default function MoneyPot( { pot }) {

    const [incomes, setIncomes] = useState([]);
    const [expenditures, setExpenditures] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [total, setTotal] = useState(0);
    const [level, setLevel] = useState('140px');

    const calculateTotal = (): void => {
        let tempTotal = 0;
        incomes.forEach((object: LiquidKind) => tempTotal += object.value);
        expenditures.forEach((object: Expenditures) => tempTotal -= object.value);
        setTotal(tempTotal);
    };

    useEffect(() => {
        const incomeData = getStoredArrayFromSession('IncomeList');
        const expenditureData = getStoredArrayFromSession('ExpenditureList');
        if (incomeData == null || expenditureData == null) {
            // get Data from firestore if no Session Data exists yet
            saveArrayToSession([], 'IncomeList');
            saveArrayToSession([], 'ExpenditureList');
            setIncomes([]);
            setExpenditures([]);
            return;
        }
        setIncomes(incomeData);
        setExpenditures(expenditureData);
        calculateTotal();
        setDirty(false);
    }, [dirty]);

    useEffect(() => {
        if (pot.goal) {
            console.log('setLevel')
            if (total === 0) setLevel('140px');
            else setLevel((150 - (150 / (pot.goal / total))) + 'px');
        }
    }, [total])

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
            <h1 className="text-5xl mb-12">{pot.name}</h1>
            <div className="grid grid-cols-3">
                <div className="col-start-2 text-center">
                    <InputField key={pot.id} dirtyState={[dirty, setDirty]} totalState={[total, setTotal]} />
                </div>
            </div>
            {pot &&
                <div className="grid grid-cols-3 gap-4 content-center">
                    <div>
                        <h4 className="text-xl">Einnahmen</h4>
                        {incomes && 
                            incomes.map(income => <Liquid layout={Layout.Income} key={income.id} deleteTrigger={deleteTrigger} data={income} />)}
                    </div>
                    <div className="align-middle text-center">
                        <FluidPot pot={pot} total={total} level={level} />
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