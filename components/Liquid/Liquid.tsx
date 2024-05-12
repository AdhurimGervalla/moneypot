import { Layout } from "../../models/Types";
import DeleteSymbol from "../Animated/DeleteSymbol";
import BeakerSymbol from "../Animated/Beaker";
import { firestore, saveArray } from "../../lib/firebase";
import { Month as MonthModel } from "../../models/Month";
import { doc, updateDoc } from "@firebase/firestore";
import { getCurrentYearAsString, getMonthName } from "../../lib/services";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import Ping from "../Animated/Ping";

export default function Liquid({
  data,
  deleteTrigger,
  pinLiquidTrigger,
  layout,
}) {
  const { user } = useContext(UserContext);

  let cssClasses = "bg-red-400";
  if (layout === Layout.Income) {
    cssClasses = "bg-green-300";
  }

  const deleteRef = () => {
    deleteTrigger(data, layout);
  };

  const pinLiquidRef = async () => {
    pinLiquidTrigger(data, layout);
  };
  return (
    <>
      {data && (
        <div className={`${cssClasses} px-3 pt-8 pb-3 relative`}>
          <Ping
            onClickEvent={pinLiquidRef}
            active={data.pinned || false}
            pingColor={layout === Layout.Income ? "bg-green-500" : "bg-red-500"}
            classes="left-0 top-0 -translate-x-1/2 cursor-pointer"
          />
          <p>
            {data.description} {data.value}
          </p>
          {!data.pinned && (
            <DeleteSymbol
              classes="absolute right-3 top-2 cursor-pointer"
              onClickEvent={deleteRef}
            />
          )}
        </div>
      )}
    </>
  );
}
