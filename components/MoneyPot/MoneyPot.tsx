import { useContext, useEffect, useState } from "react";
import { Layout } from "../../models/Types";
import InputField from "./InputField";
import { LiquidKind } from "../../models/LiquidKind";
import FluidPot from "./FluidPot";
import Liquid from "../Liquid/Liquid";
import { firestore, getDocument } from "../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";
import toast from "react-hot-toast";
import Ping from "../Animated/Ping";
import { Props } from "../../models/Types";
import { UserContext } from "../../lib/context";
import { getCurrentYearAsString, objUnion } from "../../lib/services";
import { FluidPotConstants } from "../../models/Pot";
import { unionWith, isEqual, differenceWith } from "lodash";
import Loader from "../Loader/Loader";
import H1 from "../H1";
import H3 from "../H3";
import H2 from "../H2";
export default function MoneyPot({ monthId, pot }: Props) {
  // TODO: Gesamte Ausgaben in der Rechten Spalte ausgeben
  // TODO: Gesamte Einnahmen in der Linken Spalte ausgeben
  // TODO: Wiederkehrende Liquids definieren können
  // TODO: Interval der wiederkehr muss definiert werden können

  const { user } = useContext(UserContext);
  const [loadingPinnedData, setLoadingPinnedData] = useState<boolean>(true);
  const [incomes, setIncomes] = useState<LiquidKind[]>([]);
  const [pinedIncomes, setPinedIncomes] = useState<LiquidKind[]>([]);
  const [expenditures, setExpenditures] = useState<LiquidKind[]>([]);
  const [pinedExpenditures, setPinedExpenditures] = useState<LiquidKind[]>([]);
  const [dirty, setDirty] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [level, setLevel] = useState<FluidPotConstants>(
    FluidPotConstants.Level
  );

  useEffect(() => {
    if (pot) {
      (async () => {
        // TODO: get global liquid kinds
        try {
          await Promise.all([
            getDocument(
              doc(firestore, "users", user.uid, "pinned", "incomes"),
              setPinedIncomes,
              "pinnedIncomes"
            ),
            getDocument(
              doc(firestore, "users", user.uid, "pinned", "expenditures"),
              setPinedExpenditures,
              "pinnedExpenditures"
            ),
          ]);
        } catch (e) {
          console.error(e);
        }
        setLoadingPinnedData(false);
      })();
      if (pot.incomes && pot.incomes.length > 0)
        setIncomes(JSON.parse(pot.incomes));
      if (pot.expenditures && pot.expenditures.length > 0)
        setExpenditures(JSON.parse(pot.expenditures));
    }
  }, []);

  useEffect(() => {
    if (!loadingPinnedData) {
      calculateTotal();
    }
  }, [incomes, expenditures, pinedIncomes, pinedExpenditures]);

  useEffect(() => {
    if (pot.goal) {
      if (total === 0) setLevel(FluidPotConstants.Level);
      else
        setLevel(
          (150 - 150 / (pot.goal / total) + "px") as FluidPotConstants.Level
        );
    }
  }, [total]);

  const calculateTotal = (): void => {
    let tempTotal = 0;
    incomes.forEach((object: LiquidKind) => (tempTotal += object.value));
    pinedIncomes.forEach((object: LiquidKind) => (tempTotal += object.value));
    expenditures.forEach((object: LiquidKind) => (tempTotal -= object.value));
    pinedExpenditures.forEach(
      (object: LiquidKind) => (tempTotal -= object.value)
    );
    setTotal(Math.round(tempTotal * 100) / 100);
  };

  const deleteTrigger = (objectToRemove: LiquidKind, layout: Layout) => {
    let filtered = [];
    if (layout === Layout.Expenditure) {
      filtered = expenditures.filter((el) => el !== objectToRemove);
      setExpenditures(filtered);
    } else {
      filtered = incomes.filter((el) => el !== objectToRemove);
      setIncomes(filtered);
    }
    setDirty(true);
  };

  const pinLiquidTrigger = (objectToPin: LiquidKind, layout: Layout) => {
    if (layout === Layout.Expenditure) {
      const index = pinedExpenditures.findIndex(
        (obj: LiquidKind) => obj.id === objectToPin.id
      );
      if (index === -1) {
        objectToPin = { ...objectToPin, pinned: true };
        setPinedExpenditures([...pinedExpenditures, objectToPin]);
        setExpenditures(
          expenditures.filter((item, i) => item.id !== objectToPin.id)
        );
      } else {
        objectToPin = { ...objectToPin, pinned: false };
        setExpenditures([...expenditures, objectToPin]);
        setPinedExpenditures(
          pinedExpenditures.filter((item, i) => i !== index)
        );
      }
    } else {
      const index = pinedIncomes.findIndex(
        (obj: LiquidKind) => obj.id === objectToPin.id
      );
      if (index === -1) {
        objectToPin = { ...objectToPin, pinned: true };
        setPinedIncomes([...pinedIncomes, objectToPin]);
        setIncomes(incomes.filter((item, i) => item.id !== objectToPin.id));
      } else {
        objectToPin = { ...objectToPin, pinned: false };
        setIncomes([...incomes, objectToPin]);
        setPinedIncomes(pinedIncomes.filter((item, i) => i !== index));
      }
    }
    setDirty(true);
  };

  const save = async () => {
    if (dirty) {
      const ref = doc(
        firestore,
        "users",
        user.uid,
        "years",
        getCurrentYearAsString(),
        "months",
        monthId,
        "pot",
        pot.id
      );
      const pinnedIncomeRef = doc(
        firestore,
        "users",
        user.uid,
        "pinned",
        "incomes"
      );
      let pinnedIncomeSnap = await getDoc(pinnedIncomeRef);
      const pinnedExpenditureRef = doc(
        firestore,
        "users",
        user.uid,
        "pinned",
        "expenditures"
      );
      let pinnedExpenditureSnap = await getDoc(pinnedExpenditureRef);

      try {
        // TODO: change db structure so this is one update call
        await Promise.all([
          updateDoc(ref, {
            incomes: JSON.stringify(incomes),
          }),
          updateDoc(ref, {
            expenditures: JSON.stringify(expenditures),
          }),
          pinnedIncomeSnap.exists()
            ? updateDoc(pinnedIncomeRef, {
                pinnedIncomes: JSON.stringify(pinedIncomes),
              })
            : await setDoc(pinnedIncomeRef, {
                pinnedIncomes: JSON.stringify(pinedIncomes),
              }),
          pinnedExpenditureSnap.exists()
            ? updateDoc(pinnedExpenditureRef, {
                pinnedExpenditures: JSON.stringify(pinedExpenditures),
              })
            : await setDoc(pinnedExpenditureRef, {
                pinnedIncomes: JSON.stringify(pinedExpenditures),
              }),
        ]);
        toast.success("Liquid saved");
      } catch (e) {
        console.error(e);
        toast.error("Could not fill up the liquid");
      }
      setDirty(false);
    }
  };

  return (
    <div>
      <H2>{pot.name}</H2>
      <InputWrapper>
        <InputField
          key={pot.id}
          incomesState={[incomes, setIncomes]}
          expendituresState={[expenditures, setExpenditures]}
          totalState={[total, setTotal]}
          dirtyState={[dirty, setDirty]}
        />
      </InputWrapper>

      {loadingPinnedData && <Loader show={true} />}
      {!loadingPinnedData && pot && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-center items-start mt-default md:mt-12">
          <div>
            <H3>Incomes</H3>
            <LiquidWrapper>
              {incomes &&
                incomes.map((income) => (
                  <Liquid
                    layout={Layout.Income}
                    key={income.id}
                    deleteTrigger={deleteTrigger}
                    pinLiquidTrigger={pinLiquidTrigger}
                    data={income}
                  />
                ))}
              {pinedIncomes &&
                pinedIncomes.map((income) => (
                  <Liquid
                    layout={Layout.Income}
                    key={income.id}
                    deleteTrigger={deleteTrigger}
                    pinLiquidTrigger={pinLiquidTrigger}
                    data={income}
                  />
                ))}
            </LiquidWrapper>
          </div>
          <div className="hidden md:block align-middle text-center md:h-auto">
            <FluidPot pot={pot} total={total} level={level} />
            <Button onClick={save} dirty={dirty} />
          </div>
          <div>
            <H3>Expenditures</H3>
            <LiquidWrapper>
              {expenditures &&
                expenditures.map((expenditure) => (
                  <Liquid
                    layout={Layout.Expenditure}
                    deleteTrigger={deleteTrigger}
                    pinLiquidTrigger={pinLiquidTrigger}
                    key={expenditure.id}
                    data={expenditure}
                  />
                ))}
              {pinedExpenditures &&
                pinedExpenditures.map((expenditure) => (
                  <Liquid
                    layout={Layout.Expenditure}
                    deleteTrigger={deleteTrigger}
                    pinLiquidTrigger={pinLiquidTrigger}
                    key={expenditure.id}
                    data={expenditure}
                  />
                ))}
            </LiquidWrapper>
          </div>
        </div>
      )}

      <InputWrapper mobileView={true}>
        <InputField
          key={pot.id}
          incomesState={[incomes, setIncomes]}
          expendituresState={[expenditures, setExpenditures]}
          totalState={[total, setTotal]}
          dirtyState={[dirty, setDirty]}
        />
      </InputWrapper>
    </div>
  );
}


/**
 * Wrapper for the input components
 * @param children - components to wrap
 */
const InputWrapper = ({ children, mobileView = false }: {children: any, mobileView?: boolean}) => {
  return (
    <div className={`${mobileView ? 'block md:hidden sticky bottom-0 left-0 w-full mt-8' : 'hidden'} md:grid md:grid-cols-3`}>
      <div className="md:col-start-2 text-center">{children}</div>
    </div>
  );
};


/**
 * Wrapper for the liquid components
 * @param children - components to wrap
 */
const LiquidWrapper = ({ children }: any) => {
  return <div className="grid grid-cols-liquid gap-default">{children}</div>;
};


/**
 * Button to save the data
 * @param onClick - function to call when button is clicked
 * @param dirty - boolean to check if data is dirty
 * @returns Button
 */
const Button = ({ onClick, dirty }: {onClick: () => {}, dirty: boolean}) => {
  return (
    <button
      id="save-data"
      className="cursor-pointer relative bg-cyan-100 px-3 py-1 m-3 hover:bg-green-200 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!dirty}
    >
      <span>Save</span>
      {dirty && <Ping />}
    </button>
  );
}