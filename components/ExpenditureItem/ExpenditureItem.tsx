import { useEffect, useState } from "react";

export default function ExpenditureItem({ deleteTrigger, item}) {
    const [deleteActive, setDeleteActive] = useState(false);

    const deleteMe = () => {
        setDeleteActive(true);
        deleteTrigger('expenditure', item.id)
    }
    
    useEffect(() => {
        (async () => {
            if (deleteActive) {
                deleteTrigger('expenditure', item.id)
                console.log('would delete me income');
            }
        })();
    }, [deleteActive])

    return(
        <>
            {item && 
            <div className="bg-red-400 hover:bg-cyan-600 my-5 p-3">
                {deleteActive && <p>loading...</p>}
                <p>{item.description}</p>
                <p>{item.value}</p>
                <p><a className="text-blue-600 visited:text-black hover:text-black cursor-pointer" onClick={deleteMe}>delete</a></p>
            </div>
            }
        </>
    )
}