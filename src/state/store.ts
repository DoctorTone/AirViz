import { create } from "zustand";

type AirVizState = {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  timeLength: number;
  airData: any;
  setAirData: (data: any) => void;
  numPlanes: number;
  setNumPlanes: (planes: number) => void;
};

const useStore = create<AirVizState>((set) => ({
  currentDay: 0,
  timeLength: 0,
  numPlanes: 20,
  setNumPlanes: (planes) => set(() => ({ numPlanes: planes })),
  setCurrentDay: (day) => set(() => ({ currentDay: day })),
  airData: null,
  setAirData: (data) => {
    const sensor = data.sensors[0];
    const length = sensor.timeseries.length;
    set(() => ({ airData: data, timeLength: length }));
  },
}));

export default useStore;
