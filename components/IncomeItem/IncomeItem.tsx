import { Income } from "../../models/Income";
export default function IncomeItem({ incomeItem }) {

    
    return(
        <>
            {incomeItem && 
            <div>
                <p>{incomeItem.description}</p>
                <p>{incomeItem.value}</p>
            </div>
            }
        </>
    )
}