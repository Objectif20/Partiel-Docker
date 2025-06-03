import { create } from "zustand";
import useMapStore from "./map";
import { reset as resetPlayerStore } from "./player";

interface StoreState {
  status: "running" | "over";
  score: number;
  updateScore: (rowIndex: number) => void;
  boxCollected: number;
  updateBoxCollected:() => void;
  endGame: () => void;
  reset: () => void;
}

const useStore = create<StoreState>((set) => ({
  status: "running",
  score: 0,
  boxCollected: 0,
  updateBoxCollected: () => {
    if (useStore.getState().score === 0) return;
    set((state) => ({ boxCollected: state.boxCollected + 1 }));
  },
  updateScore: (rowIndex: number) => {
    set((state) => ({ score: Math.max(rowIndex, state.score) }));
  },
  endGame: () => {
    set({ status: "over" });
  },
  reset: () => {
    useMapStore.getState().reset();
    resetPlayerStore();
    set({ status: "running", score: 0, boxCollected: 0 });
  },
}));

export default useStore;