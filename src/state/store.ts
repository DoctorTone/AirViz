import { create } from "zustand";
import { Color } from "three";

type AirVizState = {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  timeLength: number;
  airData: any;
  setAirData: (data: any) => void;
  numPlanes: number;
  setNumPlanes: (planes: number) => void;
  planeOpacity: number;
  setPlaneOpacity: (opacity: number) => void;
  skyColour: Color;
  setSkyColour: (newColour: string) => void;
};

const useStore = create<AirVizState>((set) => ({
  currentDay: 0,
  timeLength: 0,
  numPlanes: 30,
  planeOpacity: 0.5,
  setNumPlanes: (planes) => set(() => ({ numPlanes: planes })),
  setPlaneOpacity: (opacity) => set(() => ({ planeOpacity: opacity })),
  setCurrentDay: (day) => set(() => ({ currentDay: day })),
  airData: null,
  skyColour: new Color("#81868b"),
  setSkyColour: (newColour) => set(() => ({ skyColour: new Color(newColour) })),
  setAirData: (data) => {
    const sensor = data.sensors[0];
    const length = sensor.timeseries.length;
    set(() => ({ airData: data, timeLength: length }));
  },
}));

export default useStore;
