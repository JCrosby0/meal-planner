import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations } from "./mutations";
import { ActionTypes } from "./action-types";
import { MutationTypes } from "./mutation-types";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    mealId: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
  [ActionTypes.toggleMealId](
    { commit }: AugmentedActionContext,
    mealId: number
  ): Promise<number>;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.toggleMealId]({ commit }, mealId) {
    return new Promise(resolve => {
      commit(MutationTypes.TOGGLE_MEAL_ID, mealId);
      resolve(mealId);
    });
  }
};
