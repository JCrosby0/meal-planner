<template>
  <div class="root">
    <h2 class="center">Browse Meals</h2>
    <div class="filter-container">
      Filter:
      <input />
    </div>
    <div class="card-container">
      <MealCard
        v-for="(k, i) in arrMealIds"
        :key="'meal-id-' + k"
        :meal-id="k"
        :selected="mealsThisWeek.includes(i)"
      />
    </div>
  </div>
</template>

<script>
import MealCard from "@/components/MealCard.vue";
import meals from "@/assets/meals.json";
import { useStore } from "../store";
import { computed } from "vue";
export default {
  components: { MealCard },
  setup() {
    const store = useStore();
    const arrMealIds = meals.map(v => v.mealId);
    const selectedMeals = computed(() => store.state.mealsThisWeek);
    const mealsThisWeek = computed(() => store.getters.selectedMealsThisWeek);
    const storedMeals = computed(
      () => JSON.parse(localStorage.getItem("storeState")).selectedMealsThisWeek
    );
    return {
      meals,
      arrMealIds,
      selectedMeals,
      mealsThisWeek,
      storedMeals
    }; // anything returned here will be available for the rest of the component
  }
  // the "rest" of the component
};
</script>

<style scoped>
.root {
  text-align: left;
}
.center {
  text-align: center;
}
.filter-container {
  padding-left: 12px;
}
.card-container {
  text-align: center;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
