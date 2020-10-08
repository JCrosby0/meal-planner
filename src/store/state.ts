import meals from "@/assets/meals.json";
const noMeals = meals.length;
console.log("There are", noMeals, "meals in the current list.");
export const state = {
  mealsThisWeek: Array(noMeals).fill(false)
};
export type State = typeof state;
