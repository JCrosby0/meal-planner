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
  [MutationTypes.INITIALISE_STORE](state: S): void;
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
const storeStateString = "storeState";
function persist(state: any): void {
  const test = localStorage.setItem(storeStateString, JSON.stringify(state));
  console.log("state persisted", state);
}

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.INITIALISE_STORE](state) {
    console.log("Initialising store from previous session");
    console.log("state: ", state);
    const dehydrated: any = localStorage.getItem(storeStateString);
    console.log("dehydrated: ", dehydrated);
    const hydrated = JSON.parse(dehydrated);
    console.log("hydrated: ", hydrated);
    if (hydrated) {
      // state = hydrated;
      Object.keys(hydrated).forEach((key: string) => {
        console.log("key", key);
        const value = hydrated[key];
        console.log("value: ", value);
        // state[key] = hydrated[key];
        // Object.assign(state, key, value)d;
        state = hydrated;
      });
      //   console.log("state loaded: ", hydrated);
    }
    console.log("state: ", state);
  },
  [MutationTypes.TOGGLE_MEAL_ID](state, mealId: number) {
    const old: boolean = state.mealsThisWeek[mealId];
    state.mealsThisWeek[mealId] = !old;
    persist(state);
  },
  [MutationTypes.ASSIGN_MEAL_ID_TO_DAY_ID](state, payload: ObjAM) {
    state.assignedMeals[payload.dayId] = payload.mealId;
    persist(state);
  },
  [MutationTypes.UNASSIGN_MEAL_ID](state, mealId: number) {
    const index = state.assignedMeals.indexOf(mealId);
    if (index > -1) {
      state.assignedMeals[index] = -1;
    }
    persist(state);
  },
  [MutationTypes.ADD_SL_ITEM](state, item: any) {
    state.additionalShoppingList = [...state.additionalShoppingList, item];
    persist(state);
  },
  [MutationTypes.REMOVE_SL_ITEM](state, item: any) {
    const index = state.additionalShoppingList.indexOf(item);
    index >= 0 && state.additionalShoppingList.splice(index, 1);
    persist(state);
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
    persist(state);
  }
};
