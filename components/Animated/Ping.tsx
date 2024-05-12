type PingProps = {
    classes?: string;
    onClickEvent?: () => void;
    active?: boolean;
    pingColor?: string;
  };
  
  export default function Ping({
    classes,
    onClickEvent,
    active = true,
    pingColor = "bg-sky-500",
  }: PingProps) {
    const stateColor = active ? pingColor : "bg-slate-300";
    return (
      <span
        className={`flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1 ${classes}`}
        onClick={onClickEvent}
      >
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stateColor} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${stateColor}`}></span>
      </span>
    );
  }
  