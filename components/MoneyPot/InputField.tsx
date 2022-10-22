import { useEffect, useState } from "react";
import { getStoredArrayFromSession, saveArrayToSession } from "../../lib/services";
import { LiquidKind } from '../../models/Liquid';
import { tuple } from "../../models/Types";
import { Keyboard } from "../../models/Types";

export default function InputField({ dirtyState, totalState }) {

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        checkInput(inputValue);
    }, [inputValue]);

    const onKeyUp = (e) => {
        if (e.keyCode == Keyboard.Enter) {
            const val = e.target.value;
            const withoutSpace = val.replaceAll(/\s/g,'');
            setInputValue(withoutSpace);
        }
    }


    const checkInput = async (input: string) => {
        if ( input.includes('+')) {
            const val = prepareString(input, '+');
            const obj: LiquidKind = {"description": val[0], "value": val[1]};
            saveArrayToSession([obj, ...getStoredArrayFromSession('IncomeList')], 'IncomeList');
            totalState[1](totalState[0] + val[1]);
            dirtyState[1](true);
        } else if(input.includes('-')) {
            const val = prepareString(input, '-');
            const obj: LiquidKind = {"description": val[0], "value": val[1]};
            saveArrayToSession([obj, ...getStoredArrayFromSession('ExpenditureList')], 'ExpenditureList');
            totalState[1](totalState[0] - val[1]);
            dirtyState[1](true);
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
            <input id="liquid-input" type="text" className="px-4 py-3 rounded-full bg-[url('/enter.svg')] bg-no-repeat bg-[center_right_1rem]" placeholder="z.B. Lohn +3300" onKeyUp={onKeyUp} />
        </>
    );
}