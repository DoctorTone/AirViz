import useStore from "../state/store";

const TimeLine = () => {
  const currentDay = useStore((state) => state.currentDay);
  const setCurrentDay = useStore((state) => state.setCurrentDay);
  const timeLength = useStore((state) => state.timeLength);

  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
      <input
        type="range"
        min="0"
        max={timeLength - 1}
        value={currentDay}
        onChange={(e) => setCurrentDay(parseInt(e.target.value))}
        style={{ width: "100%" }}
      />
      <p style={{ color: "white" }}>
        Day {currentDay + 1} of {timeLength}
      </p>
    </div>
  );
};

export default TimeLine;
