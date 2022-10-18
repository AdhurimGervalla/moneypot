import { useEffect, useState } from "react"

export default function IncomeItem({ incomeItem, deleteTrigger }) {
    const [deleteActive, setDeleteActive] = useState(false);

    const deleteMe = () => {
        setDeleteActive(true); 
    }

    useEffect(() => {
        (async () => {
            if (deleteActive) {
                deleteTrigger('income', incomeItem.id)
                console.log('would delete me income');
            }
        })();
    }, [deleteActive])

    return(
        <>
            {incomeItem && 
            <div className="bg-sky-500/[.09] hover:bg-cyan-600 my-5 p-3">
                {deleteActive && <p>loading ...</p>}
                <p>{incomeItem.description}</p>
                <p>{incomeItem.value}</p>
                <p><a className="text-blue-600 visited:text-black hover:text-black cursor-pointer" onClick={deleteMe}>delete</a></p>
            </div>
            }
        </>
    )
}