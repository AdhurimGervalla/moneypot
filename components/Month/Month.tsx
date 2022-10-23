import Link from "next/link";
import {getCurrentMonthAsString, getCurrentYearAsString} from "../../lib/services";
import {Props} from "../../models/Types";
import Ping from "../Animated/Ping";

export default function Month({month}: Props) {
    console.log(getCurrentMonthAsString())
    return (
            <div className={`${getCurrentMonthAsString() === month.id ? 'bg-indigo-800' : ''} bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer relative`}>
            {getCurrentMonthAsString() === month.id ? <Ping /> : ''}
            <div className="px-6 py-7 text-white">
                {month && <Link href={`/${getCurrentYearAsString()}/${month.id}`}><a className="absolute top-0 bottom-0 right-0 left-0 text-center items-center flex justify-center">{month.name}</a></Link>}
            </div>
        </div>
    )
}