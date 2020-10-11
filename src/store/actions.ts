import { ActionTree, ActionContext } from "vuex";
import { State } from "./state";
import { Mutations, ObjAM } from "./mutations";
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
  [ActionTypes.assignMeal](
    { commit }: AugmentedActionContext,
    payload: object
  ): Promise<object>;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.toggleMealId]({ state, commit }, mealId) {
    return new Promise(resolve => {
      commit(MutationTypes.TOGGLE_MEAL_ID, mealId);
      if (state.assignedMeals.includes(mealId)) {
        commit(MutationTypes.UNASSIGN_MEAL_ID, mealId);
      }
      resolve(mealId);
    });
  },
  [ActionTypes.assignMeal]({ commit }, payload: ObjAM) {
    return new Promise(resolve => {
      commit(MutationTypes.UNASSIGN_MEAL_ID, payload.mealId);
      commit(MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID, payload);
      resolve(payload);
    });
  },
  [ActionTypes.AddItemToShoppingList]({ commit }, payload: object) {
    return new Promise(resolve => {
      commit(MutationTypes.ADD_SL_ITEM, payload);
      resolve(payload);
    });
  },
  [ActionTypes.RemoveItemFromShoppingList]({ commit }, payload: object) {
    return new Promise(resolve => {
      commit(MutationTypes.REMOVE_SL_ITEM, payload);
      resolve(payload);
    });
  }
};
