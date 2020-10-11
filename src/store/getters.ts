import { GetterTree } from "vuex";
import { State } from "./state";
import meals from "@/assets/meals.json";

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
  },
  assignedMealsThisWeek: state => {
    const ph = {
      nameAdult: "Drag a meal here",
      mealId: -1
    };
    return state.assignedMeals.map(mealId => {
      return meals.find(n => n.mealId === mealId) || ph;
    });
  }
};
