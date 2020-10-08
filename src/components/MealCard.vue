<template>
  <div
    class="meal-card"
    :class="{ 'meal-card-selected': selected }"
    @click="selectMeal(mealObj)"
  >
    <div class="card-header">
      <span class="title">{{ mealObj.nameKids }}</span
      ><br />
      <span class="sub-title">aka: {{ mealObj.nameAdult }}</span>
    </div>
    <div class="card-image">
      <img
        class="image"
        :alt="mealObj.nameAdult"
        :src="getImgUrl(mealObj.src)"
      />
    </div>
    <div class="card-footer">
      <div class="tag-container">
        <div v-for="tag in mealObj.tags" :key="tag" class="tag">
          <span>
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="time-container">
        <i v-if="mealObj.prepTime === 'short'" class="material-icons">
          hourglass_empty
        </i>
        <i v-if="mealObj.prepTime === 'long'" class="material-icons">
          hourglass_full
        </i>
      </div>
      <div class="rating-container">
        <i class="material-icons blue">thumb_up</i>
        <span>{{ mealObj.ratings.T }}</span>
        <i class="material-icons pink">thumb_up</i>
        <span>{{ mealObj.ratings.F }}</span>
      </div>
      <div class="button" :class="{ 'button-selected': selected }">
        <i class="material-icons" @click="selectMeal(mealObj)">
          {{ selectedIcon }}
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import meals from "@/assets/meals.json";
import { computed } from "vue";
export default {
  props: {
    mealId: { type: Number, required: true },
    selected: { type: Boolean, required: false, default: () => false }
  },
  setup(props) {
    // get the appropriate object from the prop mealId
    const mealObj = meals.find(m => m.mealId === props.mealId);
    const selectedIcon = computed(() => (props.selected ? "remove" : "add"));
    return {
      mealObj,
      selectedIcon
    }; // anything returned here will be available for the rest of the component
  },
  // the "rest" of the component
  methods: {
    // to import image assets cannot be dynamically imported in the template
    getImgUrl(pic) {
      return require("../assets/meals/" + pic);
    },
    // store action dispatch to toggle the selection of indicated meal
    selectMeal(obj) {
      this.$store.dispatch("toggleMealId", obj.mealId);
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 500;
}
.sub-title {
  font-size: 1rem;
  font-weight: 100;
}
.meal-card {
  border: 1px grey solid;
  background-color: #efefef;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin: auto;
  border-radius: 12px;
  margin: 12px;
  box-sizing: border-box;
  /* width: 300px; */
}
.meal-card-selected {
  border: 1px green solid;
  background: lightgreen;
}
.card-header {
  padding: 12px;
  flex: 0 0 auto;
  text-align: left;
}
.card-image {
  flex: 1 1 auto;
  width: 100%;
}
.image {
  width: 300px;
  height: 200px;
}
.card-footer {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}
.tag-container {
  display: flex;
  flex-direction: row;
}
.time-container,
.rating-container {
  line-height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.tag {
  border: 1px green solid;
  border-radius: 6px 0;
  background: green;
  color: white;
  padding: 3px;
  margin: 3px;
}

.blue {
  color: blue;
}
.pink {
  color: pink;
}
.button {
  border: 1px solid;
  width: 36px;
  height: 36px;
  background: green;
  border-radius: 18px;
  color: white;
  text-align: center;
  box-shadow: 2px;
  line-height: 36px;
  box-sizing: border-box;
  padding: 5px;
  cursor: pointer;
}
.button-selected {
  color: green;
  background: white;
}
</style>
