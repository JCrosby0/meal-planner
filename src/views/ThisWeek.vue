<template>
  <div class="this-week-root" @dragend="dragEnd()">
    <h1>
      List of meals selected for this week
    </h1>
    <h4>
      There are currently {{ mealsThisWeek.length }} meals selected.<br />
    </h4>
    <!-- 2 columns, assigned and unassigned -->
    <div class="meal-order-planner">
      <div class="assigned">
        Assigned Meals ({{ orderedMealsCount }})
        <span v-for="(day, i) in dayOfWeek" :key="'row-item' + i">
          <div :id="day" class="row-item">
            <div class="day-item">{{ day }}:</div>
            <MealToken
              :name="orderedMealObjects[i].nameAdult"
              :meal-id="orderedMealObjects[i].mealId"
              class="dropzone"
              :class="{ draggable: orderedMealObjects[i].mealId > -1 }"
              :draggable="orderedMealObjects[i].mealId > -1"
              @dragstart="e => dragStart(e, orderedMealObjects[i])"
              @drop="e => onDrop(e, i)"
              @dragenter.prevent="e => dragOver(e)"
              @dragleave.prevent="e => dragOver(e)"
              @dragover.prevent
              @remove="removeMeal(selectedMeal(i))"
            />
          </div>
        </span>
      </div>
      <div class="unassigned">
        Unassigned Meals ({{ unassignedMeals.length }}):
        <div v-for="meal in unassignedMeals" :key="meal">
          <MealToken
            :name="meal.nameAdult"
            :meal-id="meal.mealId"
            class="draggable"
            :draggable="true"
            @dragstart="e => dragStart(e, meal)"
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
const placeholder = {
  nameAdult: "Drag a meal here",
  mealId: -1
};
import MealToken from "@/components/MealToken";
import meals from "@/assets/meals.json";
import { useStore } from "../store";
import { computed } from "vue";
export default {
  components: { MealToken },
  setup() {
    const store = useStore();
    const selectedMeals = computed(() => store.state.mealsThisWeek); // [true, false, false, true, false...]
    const orderedMeals = computed(() => store.state.assignedMeals);
    const orderedMealObjects = computed(() => {
      return store.state.assignedMeals.map(mealId => {
        return meals.find(n => n.mealId === mealId) || placeholder;
      });
    });
    const orderedMealsCount = computed(
      () => store.state.assignedMeals.filter(m => m !== -1).length
    );
    const mealsThisWeek = computed(() => store.getters.selectedMealsThisWeek); // [1, 5, ...]
    const unassignedMeals = computed(() => {
      const toPlaceMealIds = store.getters.selectedMealsThisWeek.filter(m => {
        return !store.state.assignedMeals.includes(m);
      });
      const unassigned = meals.filter(m => toPlaceMealIds.includes(m.mealId));
      // .map(m => m.nameAdult);
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
      orderedMealsCount,
      orderedMealObjects,
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
      this.$store.dispatch("toggleMealId", meal.mealId);
    },
    toggleDroppable(setTo = "toggle") {
      const zones = document.getElementsByClassName("dropzone");
      switch (setTo) {
        case "toggle":
          zones.forEach(z => z.classList.toggle("droppable"));
          break;
        case "true":
        case true:
          zones.forEach(z => z.classList.add("droppable"));
          break;
        case "false":
        case false:
          zones.forEach(z => z.classList.remove("droppable"));
          zones.forEach(z => z.classList.remove("drag-hover"));
      }
    },
    logEvent(e, x) {
      // generic function for logging what's going on
      console.log(e.type, e, x);
    },
    // dragPrevent(e) {
    //   // figure out where this is actually needed.
    //   e.preventDefault();
    //   console.log("drag prevent fired: ", e);
    // },
    dragStart(e, meal) {
      // toggle all the droppable zones
      //   console.log("drag start: ", e, meal);
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("meal", JSON.stringify(meal));
      // add meal id to dataTransfer
      this.toggleDroppable(true);
    },
    dragEnd() {
      // when dragging ends, remove all droppable highlghting
      //   console.log("drag end: ", e);
      this.toggleDroppable(false);
    },
    dragOver(e) {
      // when dragging over a droppable, change color for confirmation
      //   console.log("drag-hover toggle:", e, x);
      e.target.classList.toggle("drag-hover");
    },
    onDrop(e, dayIndex) {
      this.toggleDroppable(false);
      const meal = JSON.parse(e.dataTransfer.getData("meal"));
      //   this.orderedMeals[dayIndex] = object.mealId;
      this.$store.dispatch("assignMeal", {
        mealId: meal.mealId,
        dayId: dayIndex
      });
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
.droppable {
  background: palegoldenrod;
}
.drag-hover {
  background: palevioletred;
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
