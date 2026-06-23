import { useControls } from "leva";
import useStore from "../state/store";

const Controls = () => {
  const setNumPlanes = useStore((state) => state.setNumPlanes);

  useControls({
    planes: {
      value: 20,
      min: 10,
      max: 100,
      onChange: (value) => {
        setNumPlanes(value);
      },
    },
  });

  return null;
};

export default Controls;
