import { useControls } from "leva";

const Controls = () => {
  useControls({
    fogNear: {
      value: 100,
      min: 50,
      max: 1000,
      onChange: (value) => {},
    },
    fogFar: {
      value: 100,
      min: 50,
      max: 1000,
      onChange: (value) => {},
    },
  });

  return null;
};

export default Controls;
