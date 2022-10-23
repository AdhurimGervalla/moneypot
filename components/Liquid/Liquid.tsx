import { Layout } from "../../models/Types";
import DeleteSymbol from "../Animated/DeleteSymbol";

export default function Liquid({ data, deleteTrigger, layout }) {

    let cssClasses = 'bg-red-400';
    if (layout === Layout.Income) {
        cssClasses = 'bg-green-300';
    }

    const deleteRef = () => {
        deleteTrigger(data, layout);
    }
    
    return(
        <>
            {data && 
            <div className={`${cssClasses} my-5 p-3 rounded-md relative`}>
                <p>{data.description}</p>
                <p>{data.value}</p>
                <DeleteSymbol classes="absolute right-2 top-2 cursor-pointer" onClickEvent={deleteRef} />
            </div>
            }
        </>
    )
}