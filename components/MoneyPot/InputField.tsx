import { useEffect, useState } from "react";
import { getStoredArrayFromSession, saveArrayToSession } from "../../lib/services";

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
            saveArrayToSession([{"description": val[0], "value": val[1]}, ...getStoredArrayFromSession('IncomeList')], 'IncomeList');
            totalState[1](totalState[0] + val[1]);
            dirtyState[1](true);
            //saveDoc<Income>(incomeRef, {"description": val[0], "value": val[1]})

        } else if(input.includes('-')) {
            const val = prepareString(input, '-');
            saveArrayToSession([{"description": val[0], "value": val[1]}, ...getStoredArrayFromSession('ExpenditureList')], 'ExpenditureList');
            totalState[1](totalState[0] - val[1]);
            dirtyState[1](true);
            //saveDoc<Expenditures>(expenditureRef, {"description": val[0], "value": val[1]});
        }
    }

    type tuple = [string, number];

    const prepareString = (str: string, operator: string): tuple => {
        const areas: string[] = str.split(operator);
        const description = areas[0];
        const value: number = parseFloat(areas[1]);
        return [description, value]
    }

    return(
        <>
            <input type="text" className="px-4 py-3 rounded-full" placeholder="z.B. Lohn +3000" onKeyUp={onKeyUp} />
        </>
    );
}