import { MutationTree } from "vuex";
// MutationTree<State> & Mutations intersection of types guarantees that a contract is correctly implemented.
import { MutationTypes } from "./mutation-types";
import { State } from "./state";

export type Mutations<S = State> = {
  [MutationTypes.TOGGLE_MEAL_ID](state: S, mealId: number): void;
  [MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID](
    state: S,
    payload: AssignMealObject
  ): void;
  [MutationTypes.UNASSIGN_MEAL_ID](state: S, mealId: number): void;
};

export interface AssignMealObject {
  dayId: number;
  mealId: number;
}
export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.TOGGLE_MEAL_ID](state, mealId: number) {
    const old: boolean = state.mealsThisWeek[mealId];
    state.mealsThisWeek[mealId] = !old;
  },
  [MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID](state, payload: AssignMealObject) {
    state.assignedMeals[payload.dayId] = payload.mealId;
  },
  [MutationTypes.UNASSIGN_MEAL_ID](state, mealId: number) {
    const index = state.assignedMeals.indexOf(mealId);
    if (index > -1) {
      state.assignedMeals[index] = false;
    }
  }
};
