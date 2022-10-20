import { Layout } from "../../models/Types";

export default function IncomeItem({ data, deleteTrigger, layout }) {

    let cssClasses = 'bg-red-400';
    if (layout === Layout.Income) {
        cssClasses = 'bg-sky-500/[.09]';
    }

    return(
        <>
            {data && 
            <div className={`${cssClasses} hover:bg-cyan-600 my-5 p-3`}>
                <p>{data.description}</p>
                <p>{data.value}</p>
                <p><a className="text-blue-600 visited:text-black hover:text-black cursor-pointer" onClick={() => deleteTrigger(data, layout)}>delete</a></p>
            </div>
            }
        </>
    )
}