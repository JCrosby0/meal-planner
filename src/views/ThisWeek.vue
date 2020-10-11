<template>
  <div class="this-week-root" @dragend="dragEnd()">
    <h2>
      This week's meals
    </h2>
    <!-- <h4>
      There are currently {{ mealsThisWeek.length }} meals selected.<br />
    </h4> -->
    <!-- 2 columns, assigned and unassigned -->
    <div class="meal-order-planner">
      <div class="assigned">
        <h4>Assigned Meals ({{ orderedMealsCount }})</h4>
        <table>
          <tr
            v-for="(day, i) in dayOfWeek"
            :id="day"
            :key="'row-item' + i"
            class="row-item"
          >
            <!-- <tr> -->
            <td>
              <div class="day-item">{{ day }}:</div>
            </td>
            <td>
              <MealToken
                :id="`day-${i}`"
                :name="orderedMealObjects[i].nameAdult"
                :meal-id="orderedMealObjects[i].mealId"
                class="dropzone"
                :class="{ draggable: orderedMealObjects[i].mealId > -1 }"
                :draggable="orderedMealObjects[i].mealId > -1"
                @dragstart="dragStart($event, orderedMealObjects[i])"
                @drop="onDrop($event, i)"
                @dragenter.prevent="dragOver($event)"
                @dragleave.prevent="dragOver($event)"
                @dragover.prevent
                @remove="removeMeal(selectedMeal(i))"
              />
            </td>
          </tr>
          <!-- </tr> -->
        </table>
      </div>
      <div class="unassigned">
        <h4>Unassigned Meals ({{ unassignedMeals.length }}):</h4>
        <div v-for="meal in unassignedMeals" :key="meal">
          <MealToken
            :name="meal.nameAdult"
            :meal-id="meal.mealId"
            class="draggable"
            :draggable="true"
            @touchstart="touchStart($event, meal)"
            @touchend="touchEnd($event, meal)"
            @dragstart="dragStart($event, meal)"
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
// const placeholder = {
//   nameAdult: "Drag a meal here",
//   mealId: -1
// };
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
    const orderedMealObjects = computed(
      () => store.getters.assignedMealsThisWeek
    );

    // const orderedMealObjects = computed(() => {
    //   return store.state.assignedMeals.map(mealId => {
    //     return meals.find(n => n.mealId === mealId) || placeholder;
    //   });
    // });
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

    const dayOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
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
    touchStart() {
      // toggle all the droppable zones
      this.toggleDroppable(true);
    },
    touchEnd(e, meal) {
      this.toggleDroppable(false);
      // recurse through drop target coordinates
      // and find one with class "dropzone"
      function findTargetId(target) {
        if (target.classList.contains("dropzone")) return target.id;
        return findTargetId(target.parentElement);
      }
      const target = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      this.$store.dispatch("assignMeal", {
        mealId: meal.mealId,
        dayId: findTargetId(target).slice(4, 5)
      });
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
  flex-wrap: wrap;
}
.unassigned,
.assigned {
  flex: 1 1 auto;
  min-width: 50%;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  padding: 0 6px;
}
.row-item {
  /* width: 100%; */
  margin: auto;
  /* display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; */
}
.day-item {
  flex: 1 0 55px;
  text-align: right;
  padding: 0 6px;
}
.draggable {
  cursor: grab;
}
.dropzone {
  /* placeholder */
  /* cursor: no-drop; */
}
.droppable {
  background: #efffef;
}
.drag-hover {
  background: #ccffcc;
}

.control-item {
  flex: 0 0 20%;
}
</style>
