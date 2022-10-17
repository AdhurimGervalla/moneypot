import Link from "next/link"

export default function MoneyPotListItem({moneyPot}) {
    return(
        <>
            
            <h3><Link href={`/${moneyPot.id}`}>{moneyPot.name}</Link></h3>
            <img src="/Pot-Of-Gold.svg" alt="" width="300" />
        </>
    );
}