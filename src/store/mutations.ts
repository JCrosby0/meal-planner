import { ObjectEmitsOptions } from "vue";
// MutationTree<State> & Mutations intersection of types guarantees that a contract is correctly implemented.
import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { State } from "./state";

export type Mutations<S = State> = {
  [MutationTypes.TOGGLE_MEAL_ID](state: S, mealId: number): void;
  [MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID](state: S, payload: ObjAM): void;
  [MutationTypes.UNASSIGN_MEAL_ID](state: S, mealId: number): void;
  [MutationTypes.ADD_SL_ITEM](state: S, item: object): void;
  [MutationTypes.REMOVE_SL_ITEM](state: S, item: object): void;
};

// AssignMealObject
export interface ObjAM {
  dayId: number;
  mealId: number;
}
export interface ObjIngredientCheck {
  ingredient: string;
  meal: string;
  status: boolean;
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.TOGGLE_MEAL_ID](state, mealId: number) {
    const old: boolean = state.mealsThisWeek[mealId];
    state.mealsThisWeek[mealId] = !old;
  },
  [MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID](state, payload: ObjAM) {
    state.assignedMeals[payload.dayId] = payload.mealId;
  },
  [MutationTypes.UNASSIGN_MEAL_ID](state, mealId: number) {
    const index = state.assignedMeals.indexOf(mealId);
    if (index > -1) {
      state.assignedMeals[index] = -1;
    }
  },
  [MutationTypes.ADD_SL_ITEM](state, item: any) {
    state.additionalShoppingList = [...state.additionalShoppingList, item];
  },
  [MutationTypes.REMOVE_SL_ITEM](state, item: any) {
    const index = state.additionalShoppingList.indexOf(item);
    index >= 0 && state.additionalShoppingList.splice(index, 1);
  },
  [MutationTypes.TOGGLE_INGREDIENT_CHECK](state, item: any) {
    const index = state.checkedItems.findIndex(
      i => i.meal === item.meal && i.ingredient === item.ingredient
    );
    if (index >= 0) {
      state.checkedItems.splice(index, 1);
    } else {
      state.checkedItems.push(item);
    }
  }
};
