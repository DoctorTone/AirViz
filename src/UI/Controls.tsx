import { useControls } from "leva";
import useStore from "../state/store";

const Controls = () => {
  const setFogNear = useStore((state) => state.setFogNear);
  const setFogFar = useStore((state) => state.setFogFar);

  useControls({
    fogNear: {
      value: 100,
      min: 50,
      max: 1000,
      onChange: (value) => {
        setFogNear(value);
      },
    },
    fogFar: {
      value: 100,
      min: 50,
      max: 3000,
      onChange: (value) => {
        setFogFar(value);
      },
    },
  });

  return null;
};

export default Controls;
