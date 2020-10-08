import meals from "@/assets/meals.json";
const noMeals = meals.length;
console.log("There are", noMeals, "meals in the current meal list.");
export const state = {
  mealsThisWeek: Array(noMeals).fill(false),
  assignedMeals: Array(7).fill(false)
};
export type State = typeof state;
