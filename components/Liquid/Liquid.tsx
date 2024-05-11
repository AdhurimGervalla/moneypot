import { Layout } from "../../models/Types";
import DeleteSymbol from "../Animated/DeleteSymbol";
import BeakerSymbol from "../Animated/Beaker";
import {firestore, saveArray} from "../../lib/firebase";
import {Month as MonthModel} from "../../models/Month";
import {doc, updateDoc} from "@firebase/firestore";
import {getCurrentYearAsString, getMonthName} from "../../lib/services";
import {useContext} from "react";
import {UserContext} from "../../lib/context";

export default function Liquid({ data, deleteTrigger, pinLiquidTrigger, layout }) {
    const {user} = useContext(UserContext);

    let cssClasses = 'bg-red-400';
    if (layout === Layout.Income) {
        cssClasses = 'bg-green-300';
    }

    const deleteRef = () => {
        deleteTrigger(data, layout);
    }

    const pinLiquidRef = async () => {
        pinLiquidTrigger(data, layout);
    }
    
    return(
        <>
            {data && 
            <div className={`${cssClasses} px-3 pt-8 pb-3 relative`}>
                <BeakerSymbol classes="absolute left-3 top-2 cursor-pointer" onClickEvent={pinLiquidRef} pinned={data.pinned} />
                <p>{data.description} {data.value}</p>
                <DeleteSymbol classes="absolute right-3 top-2 cursor-pointer" onClickEvent={deleteRef} />
            </div>
            }
        </>
    )
}