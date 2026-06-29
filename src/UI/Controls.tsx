import { useControls } from "leva";
import useStore from "../state/store";

const Controls = () => {
  const setNumPlanes = useStore((state) => state.setNumPlanes);
  const setPlaneOpacity = useStore((state) => state.setPlaneOpacity);
  const setSkyColour = useStore((state) => state.setSkyColour);

  useControls({
    planes: {
      value: 20,
      min: 10,
      max: 50,
      step: 1.0,
      onChange: (value) => {
        setNumPlanes(value);
      },
    },
    opacity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.1,
      onChange: (value) => {
        setPlaneOpacity(value);
      },
    },
    sky: {
      value: "#81868b",
      onChange: (value) => {
        setSkyColour(value);
      },
    },
  });

  return null;
};

export default Controls;
