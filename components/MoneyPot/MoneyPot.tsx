import {useContext, useEffect, useState} from "react";
import {Layout} from "../../models/Types";
import InputField from "./InputField";
import {LiquidKind} from "../../models/LiquidKind";
import FluidPot from "./FluidPot";
import Liquid from "../Liquid/Liquid";
import {firestore} from "../../lib/firebase";
import {doc, updateDoc} from "firebase/firestore";
import toast from 'react-hot-toast';
import Ping from "../Animated/Ping";
import {Props} from "../../models/Types";
import {UserContext} from "../../lib/context";
import {getCurrentYearAsString} from "../../lib/services";
import {FluidPotConstants} from "../../models/Pot";

export default function MoneyPot({monthId, pot}: Props) {

    // TODO: Gesamte Ausgaben in der Rechten Spalte ausgeben
    // TODO: Gesamte Einnahmen in der Linken Spalte ausgeben
    // TODO: Wiederkehrende Liquids definieren können
    // TODO: Interval der wiederkehr muss definiert werden können

    const {user} = useContext(UserContext);
    const [incomes, setIncomes] = useState([]);
    const [expenditures, setExpenditures] = useState([]);
    const [dirty, setDirty] = useState(false);
    const [total, setTotal] = useState(0);
    const [level, setLevel] = useState(FluidPotConstants.Level);

    useEffect(() => {
        if (pot) {
            if (pot.incomes !== undefined) setIncomes(JSON.parse(pot.incomes));
            if (pot.expenditures !== undefined) setExpenditures(JSON.parse(pot.expenditures));
            calculateTotal();
        }
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [incomes, expenditures])

    useEffect(() => {
        if (pot.goal) {
            if (total === 0) setLevel(FluidPotConstants.Level);
            else setLevel(((150 - (150 / (pot.goal / total))) + 'px') as FluidPotConstants.Level);
        }
    }, [total]);

    const calculateTotal = (): void => {
        let tempTotal = 0;
        incomes.forEach((object: LiquidKind) => tempTotal += object.value);
        expenditures.forEach((object: LiquidKind) => tempTotal -= object.value);
        setTotal(tempTotal);
    };

    const deleteTrigger = (objectToRemove: LiquidKind, layout: Layout) => {
        let filtered = [];
        if (layout === Layout.Expenditure) {
            filtered = expenditures.filter((el) => el !== objectToRemove);
            setExpenditures(filtered);

        } else {
            filtered = incomes.filter((el) => el !== objectToRemove);
            setIncomes(filtered);
        }
        setDirty(true);
    }

    const save = () => {
        if (dirty) {
            const ref = doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months', monthId, 'pot', pot.id);
            updateDoc(ref, {
                incomes: JSON.stringify(incomes)
            });
            updateDoc(ref, {
                expenditures: JSON.stringify(expenditures)
            });
            toast.success('Liquid saved')
            setDirty(false);
        }

    }

    return (
        <div>
            <h1 className="text-5xl mb-12">{pot.name}</h1>
            <div className="grid grid-cols-3">
                <div className="col-start-2 text-center">
                    <InputField key={pot.id} incomesState={[incomes, setIncomes]}
                                expendituresState={[expenditures, setExpenditures]} totalState={[total, setTotal]}
                                dirtyState={[dirty, setDirty]}/>
                </div>
            </div>
            {pot &&
                <div className="grid grid-cols-3 gap-4 content-center items-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <h4 className="text-xl">Einnahmen</h4>
                        {incomes &&
                            incomes.map(income => <Liquid layout={Layout.Income} key={income.id}
                                                          deleteTrigger={deleteTrigger} data={income}/>)}
                    </div>
                    <div className="align-middle text-center">
                        <FluidPot pot={pot} total={total} level={level}/>
                        <button id="save-data"
                                className="cursor-pointer relative bg-cyan-100 px-3 py-1 m-3 hover:bg-green-200 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                                onClick={save} disabled={!dirty}>
                            <span>Save</span>
                            {dirty && <Ping/>}
                        </button>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <h4 className="text-xl">Ausgaben</h4>
                        {expenditures &&
                            expenditures.map(expenditure => <Liquid layout={Layout.Expenditure}
                                                                    deleteTrigger={deleteTrigger} key={expenditure.id}
                                                                    data={expenditure}/>)}
                    </div>
                </div>
            }
        </div>
    );

}