import { useCallback, useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import debounce from 'lodash.debounce';
import { saveDoc } from "../../lib/firebase";
import {Income} from "../../models/Income";
import Expenditures from "../../models/Expenditures";

export default function InputField({ incomeRef, expenditureRef }) {

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        checkInput(inputValue);
    }, [inputValue]);

    const onKeyUp = useCallback(
        debounce(async (e) => {
            if (e.keyCode == 13) {
                const val = e.target.value;
                const withoutSpace = val.replaceAll(/\s/g,'');
                setInputValue(withoutSpace);
            }
        }, 500),
        []
    )

    const checkInput = async (input: string) => {
        if ( incomeRef && input.includes('+')) {
            const val = prepareString(input, '+');
            saveDoc<Income>(incomeRef, {"description": val[0], "value": val[1]})

        } else if(expenditureRef && input.includes('-')) {
            const val = prepareString(input, '-');
            saveDoc<Expenditures>(expenditureRef, {"description": val[0], "value": val[1]});
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