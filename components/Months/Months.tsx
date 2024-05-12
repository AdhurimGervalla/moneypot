import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../lib/context";
import { collection, doc, setDoc } from "@firebase/firestore";
import { firestore, getCollection, saveDoc } from "../../lib/firebase";
import Loader from "../Loader/Loader";
import Month from "../Month/Month";
import { Month as MonthModel } from "../../models/Month";
import {
  getCurrentMonthAsString,
  getCurrentYearAsString,
  getMonthName,
} from "../../lib/services";
import toast from "react-hot-toast";

export default function Months() {
  // TODO: [Pony] Pro Monat kann das Pot Layout geändert werden
  const { user } = useContext(UserContext);
  const [months, setMonths] = useState<MonthModel[]>();
  const [ghostMonths, setGhostMonths] = useState<MonthModel[]>([]);

  useEffect(() => {
    (async () => {
      const collectionRef = collection(
        firestore,
        "users",
        user.uid,
        "years",
        getCurrentYearAsString(),
        "months"
      );
      await getCollection<MonthModel[]>(collectionRef, setMonths, "sorting");
    })();
  }, []);

  useEffect(() => {
    if (months === undefined) return;
    if (
      months.findIndex((month) => month.id === getCurrentMonthAsString()) === -1
    ) {
      (async () => {
        try {
          const currentMonth: string = getCurrentMonthAsString();
          const nextMonth: MonthModel = {
            id: currentMonth,
            name: getMonthName(parseInt(getCurrentMonthAsString())),
            sorting: parseInt(getCurrentMonthAsString()),
          };
          await saveDoc<MonthModel>(
            doc(
              firestore,
              "users",
              user.uid,
              "years",
              getCurrentYearAsString(),
              "months",
              currentMonth
            ),
            nextMonth
          );
        } catch (e) {
          console.error("Auto generation of new month failed");
          toast.error("Auto generation of new month failed");
        }
      })();
    }
    createFutureMonths(user, months, ghostMonths, setGhostMonths);
  }, [months]);

  useEffect(() => {
    console.log("ghostMonths", ghostMonths);
  }, [ghostMonths]);

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {months && months.map((el) => <Month key={el.id} month={el} />)}
        {ghostMonths &&
          ghostMonths.map((el) => <Month key={el.id} month={el} />)}
      </ul>
    </>
  );
}

/**
 * Function which checks what future months are missing and creates them
 * for example if the current month is 05 then it creates 06, 07, 08, 09, 10, 11, 12
 */

const createFutureMonths = async (
  user,
  months,
  ghostMonths,
  setGhostMonths
) => {
  const currentMonth = parseInt(getCurrentMonthAsString());
  const currentYear = parseInt(getCurrentYearAsString());
  const futureMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(
    (month) => month > currentMonth
  );
  const futureMonthsToCreate = futureMonths.filter(
    (month) => months.findIndex((el) => el.id === month.toString()) === -1
  );
  const futureMonthsObjects: MonthModel[] = [];
  for (const month of futureMonthsToCreate) {
    const nextMonth: MonthModel = {
      id: month.toString(),
      name: getMonthName(month),
      sorting: month,
    };
    futureMonthsObjects.push(nextMonth);
  }
  setGhostMonths(futureMonthsObjects);
};
