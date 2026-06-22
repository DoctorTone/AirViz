import { create } from "zustand";

type AirVizState = {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  timeLength: number;
  airData: any;
  setAirData: (data: any) => void;
  fogNear: number;
  fogFar: number;
  setFogNear: (near: number) => void;
  setFogFar: (far: number) => void;
};

const useStore = create<AirVizState>((set) => ({
  currentDay: 0,
  timeLength: 0,
  fogNear: 100,
  fogFar: 100,
  setFogNear: (near) => set(() => ({ fogNear: near })),
  setFogFar: (far) => set(() => ({ fogNear: far })),
  setCurrentDay: (day) => set(() => ({ currentDay: day })),
  airData: null,
  setAirData: (data) => {
    const sensor = data.sensors[0];
    const length = sensor.timeseries.length;
    set(() => ({ airData: data, timeLength: length }));
  },
}));

export default useStore;
