import { useEffect, useState } from "react";
import { getStoredArrayFromSession, saveArrayToSession } from "../../lib/services";
import uniqueId from 'lodash.uniqueid';
import { Coin } from '../../models/Coin';
import { tuple } from "../../models/Types";

export default function InputField({ dirtyState, totalState }) {

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        checkInput(inputValue);
    }, [inputValue]);

    const onKeyUp = (e) => {
        if (e.keyCode == 13) {
            const val = e.target.value;
            const withoutSpace = val.replaceAll(/\s/g,'');
            setInputValue(withoutSpace);
        }
    }


    const checkInput = async (input: string) => {
        if ( input.includes('+')) {
            const val = prepareString(input, '+');
            const obj: Coin = {id: uniqueId('in_'), "description": val[0], "value": val[1]};
            saveArrayToSession([obj, ...getStoredArrayFromSession('IncomeList')], 'IncomeList');
            totalState[1](totalState[0] + val[1]);
            dirtyState[1](true);
            //saveDoc<Income>(incomeRef, {"description": val[0], "value": val[1]})

        } else if(input.includes('-')) {
            const val = prepareString(input, '-');
            const obj: Coin = {id: uniqueId('exp_'), "description": val[0], "value": val[1]};
            saveArrayToSession([obj, ...getStoredArrayFromSession('ExpenditureList')], 'ExpenditureList');
            totalState[1](totalState[0] - val[1]);
            dirtyState[1](true);
            //saveDoc<Expenditures>(expenditureRef, {"description": val[0], "value": val[1]});
        }
    }



    const prepareString = (str: string, operator: string): tuple => {
        const areas: string[] = str.split(operator);
        const description = areas[0];
        const value: number = parseFloat(areas[1]);
        return [description, value];
    }

    return(
        <>
            <input type="text" className="px-4 py-3 rounded-full" placeholder="z.B. Lohn +3300" onKeyUp={onKeyUp} />
        </>
    );
}