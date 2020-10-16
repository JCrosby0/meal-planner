import { GetterTree } from "vuex";
import { State } from "./state";
import meals from "@/assets/meals.json";
interface MealObj {
  ingredients: string[];
  nameAdult: string;
}
interface CheckedObj {
  name: string;
  meal: string;
  checked: boolean;
}

const ingredientMapper = (acc: any[], meal: MealObj) => {
  return [
    ...acc,
    ...meal.ingredients.map(i => {
      return {
        name: i,
        ingredient: i,
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
    return state.assignedMeals.map((mealId: number) => {
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
    const combined = [...additionalIngredients, ...mealIngredients];
    // go through ALL items in the combined list
    combined.forEach(c => {
      // go through checked items until one match is found
      if (
        state.checkedItems.some(item => {
          if (item.meal === c.meal && item.ingredient === c.ingredient) {
            c.checked = true;
            // break the .some iteration
            return true;
          }
        })
      ) {
        c.checked = true;
      } else {
        c.checked = false;
      }
      return;
    });
    return combined;
  }
};
