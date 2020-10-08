<template>
  <div class="this-week-root">
    <h1>
      List of meals selected for this week
    </h1>
    <h4>
      There are currently {{ mealsThisWeek.length }} meals selected.<br />
    </h4>
    <!-- 2 columns, assigned and unassigned -->
    <div class="meal-order-planner">
      <div class="assigned">
        Assigned Meals ({{ orderedMeals.filter(m => !!m).length }})
        <span v-for="(day, i) in dayOfWeek" :key="'row-item' + i">
          <div :id="day" class="row-item" @drop="e => onDrop(e, day)">
            <!-- @dragenter="dragOver(day)" -->
            <!-- @dragleave="dragOver(day)" -->
            <div class="day-item">{{ day }}:</div>
            <MealToken
              :name="selectedMeal(i)"
              class="dropzone"
              :class="{ draggable: selectedMeal(i) }"
              @remove="payload => removeMeal(selectedMeal(i), payload)"
            />
          </div>
        </span>
      </div>
      <div class="unassigned">
        Unassigned Meals ({{ unassignedMeals.length }}):
        <div v-for="meal in unassignedMeals" :key="meal">
          <MealToken
            :name="meal"
            class="draggable"
            @dragstart="e => dragStart(e, meal)"
            @remove="payload => removeMeal(meal, payload)"
          />
          <!-- @dragend="e => logEvent(e, 'token')" -->
          <!-- @drag="e => logEvent(e, 'token')" -->
          <!-- @mousedown="e => logEvent(e, 'token')" -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MealToken from "@/components/MealToken";
import meals from "@/assets/meals.json";
import { useStore } from "../store";
import { computed, reactive } from "vue";
export default {
  components: { MealToken },
  setup() {
    const store = useStore();
    const selectedMeals = computed(() => store.state.mealsThisWeek); // [true, false, false, true, false...]
    const mealsThisWeek = computed(() => store.getters.selectedMealsThisWeek); // [1, 5, ...]
    const orderedMeals = reactive(Array(7).fill(false));
    const unassignedMeals = computed(() => {
      const toPlaceMealIds = store.getters.selectedMealsThisWeek.filter(
        m => !orderedMeals.includes(m)
      );
      const unassigned = meals
        .filter(m => toPlaceMealIds.includes(m.mealId))
        .map(m => m.nameAdult);
      return unassigned;
    });
    const mealsTWObj = computed(() =>
      meals.filter(m => store.getters.selectedMealsThisWeek.includes(m.mealId))
    ); // [{}, {}, ...]

    const dayOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];
    return {
      meals,
      selectedMeals,
      mealsThisWeek,
      mealsTWObj,
      dayOfWeek,
      orderedMeals,
      unassignedMeals
    }; // anything returned here will be available for the rest of the component
  },
  // the "rest" of the component
  methods: {
    selectedMeal(orderedId) {
      const meal = meals.find(i => i.mealId === this.orderedMeals[orderedId]);
      return meal ? meal.nameAdult : undefined;
    },
    removeMeal(meal, payload) {
      if (!meal) return;
      console.log("remove meal: ", meal, payload);
    },
    toggleDroppable() {
      document
        .getElementsByClassName("dropzone")
        .forEach(element => element.classList.toggle("droppable"));
    },
    logEvent(e, x) {
      // generic function for logging what's going on
      console.log(e.type, e, x);
    },
    dragPrevent(e) {
      // figure out where this is actually needed.
      e.preventDefault();
      console.log("drag prevent fired: ", e);
    },
    dragStart(e, meal) {
      // toggle all the droppable zones
      console.log("drag start: ", e, meal);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("meal", meal);
      // add meal id to dataTransfer
      this.toggleDroppable();
    },
    dragEnd(e) {
      // when dragging ends, remove all droppable highlghting
      console.log("drag end: ", e);
      this.toggleDroppable();
    },
    dragOver(x) {
      // when dragging over a droppable, change color for confirmation
      console.log("drag over:", x);
      document.getElementById(x).classList.toggle("drag-hover");
    },
    onDrop(e, day) {
      const meal = e.dataTransfer.getData("meal");
      const object = meals.find(m => (m.nameAdult = meal));
      console.log("day: ", day, " received drop: ", meal, object);
    }
  }
};
</script>

<style scoped>
.meal-order-planner {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  /* flex-wrap: wrap; */
}
.unassigned,
.assigned {
  flex: 1 1 50%;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 0 6px;
}
.row-item {
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
.day-item {
  flex: 0 0 100px;
  text-align: right;
  padding-right: 6px;
}
.draggable {
  cursor: grab;
}
.dropzone {
  /* placeholder */
  /* cursor: no-drop; */
}
.drag-hover {
  background: paleturquoise;
}
.droppable {
  background: palegoldenrod;
}
/* .meal-item {
  flex: 1 0 200px;
  padding: 12px;
  border: 1px grey solid;
  border-radius: 6px;
  cursor: move;
}
.meal-item-un {
  flex: 0 0 auto;
  margin: 6px auto;
  min-width: 200px;
  padding: 12px;
  border: 1px grey solid;
  border-radius: 6px;
  cursor: move;
} */
.control-item {
  flex: 0 0 20%;
}
</style>
