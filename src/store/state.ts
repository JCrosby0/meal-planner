import meals from "@/assets/meals.json";
const noMeals = meals.length;
console.log("There are", noMeals, "meals in the current meal list.");
import { ObjIngredientCheck } from "./mutations";

interface StateType {
  mealsThisWeek: boolean[];
  assignedMeals: number[];
  additionalShoppingList: ObjIngredientCheck[];
  checkedItems: ObjIngredientCheck[];
}
export const state: StateType = {
  mealsThisWeek: Array(noMeals).fill(false), // [ boolean, ... ]
  assignedMeals: Array(7).fill(-1), // [ number, ...]
  additionalShoppingList: [], // [ object, ...]
  checkedItems: [] // [object, ...]
};
export type State = typeof state;
