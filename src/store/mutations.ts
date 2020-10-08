import { MutationTree } from "vuex";
// MutationTree<State> & Mutations intersection of types guarantees that a contract is correctly implemented.
import { MutationTypes } from "./mutation-types";
import { State } from "./state";

export type Mutations<S = State> = {
  [MutationTypes.TOGGLE_MEAL_ID](state: S, mealId: number): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.TOGGLE_MEAL_ID](state, mealId: number) {
    const old: boolean = state.mealsThisWeek[mealId];
    state.mealsThisWeek[mealId] = !old;
  }
};
