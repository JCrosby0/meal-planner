import { GetterTree } from "vuex";
import { State } from "./state";

export type Getters = {
  selectedMealsThisWeek(state: State): number[];
};

export const getters: GetterTree<State, State> & Getters = {
  selectedMealsThisWeek: state => {
    const arrayOfTrueIndices = (acc: number[], cur: boolean, idx: number) => {
      cur && acc.push(idx);
      return acc;
    };
    return state.mealsThisWeek.reduce(arrayOfTrueIndices, []);
  }
};
