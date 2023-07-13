import {useContext, useEffect, useState} from "react";
import {Layout} from "../../models/Types";
import InputField from "./InputField";
import {LiquidKind, LiquidKindConverter} from "../../models/LiquidKind";
import FluidPot from "./FluidPot";
import Liquid from "../Liquid/Liquid";
import {firestore, getCollection, getDocument} from "../../lib/firebase";
import {collection, doc, getDoc, updateDoc} from "@firebase/firestore";
import toast from 'react-hot-toast';
import Ping from "../Animated/Ping";
import {Props} from "../../models/Types";
import {UserContext} from "../../lib/context";
import {getCurrentYearAsString, objUnion} from "../../lib/services";
import {FluidPotConstants} from "../../models/Pot";
import {unionWith, isEqual} from "lodash";
export default function MoneyPot({monthId, pot}: Props) {

    // TODO: Gesamte Ausgaben in der Rechten Spalte ausgeben
    // TODO: Gesamte Einnahmen in der Linken Spalte ausgeben
    // TODO: Wiederkehrende Liquids definieren können
    // TODO: Interval der wiederkehr muss definiert werden können

    const {user} = useContext(UserContext);
    const [incomes, setIncomes] = useState([]);
    const [pinedIncomes, setPinedIncomes] = useState<LiquidKind[]>(undefined);
    const [expenditures, setExpenditures] = useState<LiquidKind[]>([]);
    const [pinedExpenditures, setPinedExpenditures] = useState<LiquidKind[]>(undefined);
    const [dirty, setDirty] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [level, setLevel] = useState<FluidPotConstants>(FluidPotConstants.Level);

    useEffect(() => {
        if (pot) {
            (async () => {
                // TODO: get global liquid kinds
                await Promise.all([
                    getDocument(doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString()), setPinedIncomes, "pinedIncomes"),
                    getDocument(doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString()), setPinedExpenditures, "pinedExpenditures"),
                ]);
            })();

            if (pot.incomes !== undefined) {
                setIncomes(unionWith(JSON.parse(pot.incomes), pinedIncomes, isEqual));
            }
            if (pot.expenditures !== undefined) {
                setExpenditures(unionWith(JSON.parse(pot.expenditures), pinedExpenditures, isEqual));
            }
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

    const pinLiquidTrigger = (objectToPin: LiquidKind, layout: Layout) => {
        if (layout === Layout.Expenditure) {
            const index = pinedExpenditures.findIndex((obj: LiquidKind) => obj.id === objectToPin.id);
            if (index === -1) {
                setPinedExpenditures([...pinedExpenditures, objectToPin]);
            } else {
                setPinedExpenditures(pinedExpenditures.splice(index, 1));
            }
        } else {
            const index = pinedIncomes.findIndex((obj: LiquidKind) => obj.id === objectToPin.id);
            console.log('index', index)
            if (index === -1) {
                setPinedIncomes([...pinedIncomes, objectToPin]);
            } else {
                setPinedIncomes(pinedIncomes.splice(index, 1));
                console.log('pinedIncomes', pinedIncomes)
            }
        }
        setDirty(true);
    }

    const save = async () => {
        if (dirty) {
            const ref = doc(firestore, 'users', user.uid, 'years', getCurrentYearAsString(), 'months', monthId, 'pot', pot.id);
            try {
                // TODO: change db structure so this is one update call
                await Promise.all([updateDoc(ref, {
                    incomes: JSON.stringify(incomes)
                }), updateDoc(ref, {
                    expenditures: JSON.stringify(expenditures)
                })]);
                toast.success('Liquid saved')
            } catch (e) {
                console.error(e);
                toast.error('Could not fill up the liquid')
            }
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
                                                          deleteTrigger={deleteTrigger} pinLiquidTrigger={pinLiquidTrigger} data={income}/>)}
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
                                                                    deleteTrigger={deleteTrigger} pinLiquidTrigger={pinLiquidTrigger} key={expenditure.id}
                                                                    data={expenditure}/>)}
                    </div>
                </div>
            }
        </div>
    );

}