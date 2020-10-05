<template>
  <div class="root">
    <h1>card list of meals</h1>
    <ul>
      <li>filterable by tags</li>
      <li>click to add to this week's meal plan</li>
    </ul>
    <div class="card-container">
      <MealCard v-for="k in arrMealIds" :key="'meal-id-' + k" :meal-id="k" />
    </div>
  </div>
</template>

<script>
import MealCard from "@/components/MealCard.vue";
import meals from "@/assets/meals.json";
export default {
  components: { MealCard },
  props: {
    user: { type: String, default: () => "joe" }
  },
  setup(props) {
    console.log(props); // { user: '' }
    console.log(meals);
    const arrMealIds = meals.map(v => v.mealId);
    return {
      meals,
      arrMealIds
    }; // anything returned here will be available for the rest of the component
  }
  // the "rest" of the component
};
</script>

<style scoped>
.card-container {
  text-align: center;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
