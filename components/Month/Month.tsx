import Link from "next/link";
import { getCurrentYearAsString } from "../../lib/services";
import { Props } from "../../models/Types";

export default function Month({ month }: Props) {
    return(
        <div>
            { month && <Link href={`/${getCurrentYearAsString()}/${month.id}`}>{month?.name}</Link>}
        </div>
    )
}