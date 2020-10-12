import { GetterTree } from "vuex";
import { State } from "./state";
import meals from "@/assets/meals.json";
interface MealObj {
  ingredients: string[];
  nameAdult: string;
}

const ingredientMapper = (acc: any[], meal: MealObj) => {
  return [
    ...acc,
    ...meal.ingredients.map(i => {
      return {
        name: i,
        checked: false,
        nameAdult: meal.nameAdult,
        meal: meal.nameAdult
      };
    })
  ];
};

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
  },
  shoppingList: state => {
    // additional Items
    const additionalIngredients = state.additionalShoppingList;
    const assignedMealIds = state.assignedMeals.filter(m => m >= 0);
    const mealIngredients = meals
      .filter(m => assignedMealIds.includes(m.mealId))
      .reduce(ingredientMapper, []);
    return [...additionalIngredients, ...mealIngredients];
  }
};
