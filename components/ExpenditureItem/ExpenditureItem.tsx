export default function ExpenditureItem({item}) {

    return(
        <>
            {item && 
            <div>
                <p>{item.description}</p>
                <p>{item.value}</p>
            </div>
            }
        </>
    )
}