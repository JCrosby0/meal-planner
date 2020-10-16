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
                @touchstart="touchStart($event, orderedMealObjects[i])"
                @touchmove="touchMove($event, orderedMealObjects[i])"
                @touchend="touchEnd($event, orderedMealObjects[i])"
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
            @touchmove.prevent="touchMove($event)"
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
let elementLastHovered;
function findParentElementWithClass(target, desiredClass) {
  if (target === null) return null;
  if (target.classList.contains(desiredClass)) return target;
  return findParentElementWithClass(target.parentElement, desiredClass);
}
export default {
  components: { MealToken },
  setup() {
    const store = useStore();
    const selectedMeals = computed(() => store.state.mealsThisWeek); // [true, false, false, true, false...]
    const orderedMeals = computed(() => store.state.assignedMeals);
    const orderedMealObjects = computed(() => {
      console.log(
        "store.getters.assignedMealsThisWeek: ",
        store.getters.assignedMealsThisWeek
      );
      return store.getters.assignedMealsThisWeek;
    });

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
      // handle any left-over hover targets
      if (elementLastHovered && elementLastHovered.classList)
        elementLastHovered.classList.remove("drag-hover");
      // handle all dropzones
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
    touchStart(e, meal) {
      if (meal.mealId < 0) return;
      // toggle all the droppable zones
      this.toggleDroppable(true);
    },
    // manually animate the element being moved
    touchMove(e, meal) {
      if (meal && meal.mealId < 0) return;
      e.preventDefault();

      // while dragging, find the currenly hovered-over target
      // and apply styling if appropriate
      const hoverTarget = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      const droppableTarget = findParentElementWithClass(
        hoverTarget,
        "droppable"
      );
      // remove hover if we moved off the target
      if (elementLastHovered && elementLastHovered !== droppableTarget) {
        elementLastHovered.classList.remove("drag-hover");
      }
      // if hovering over a droppable target, add the drag hover class
      if (droppableTarget) {
        droppableTarget.classList.add("drag-hover");
        // save this element for next time
        elementLastHovered = droppableTarget;
      }

      // style the element being dragged to move with the touch
      // check parents for being draggable in case we click on a child element
      const dragElement = findParentElementWithClass(e.target, "draggable");
      const xPos = e.touches[0].pageX;
      const yPos = e.touches[0].pageY;
      dragElement.style.x = xPos;
      dragElement.style.y = yPos;
      dragElement.style.zIndex = dragElement.style.zIndex + 10;
      //   this probably needs to be play with position absolute
    },
    touchEnd(e, meal) {
      if (meal.mealId < 0) return;
      e.target.style.position = "relative";
      this.toggleDroppable(false);
      const target = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      this.$store.dispatch("assignMeal", {
        mealId: meal.mealId,
        dayId: findParentElementWithClass(target, "dropzone").id.slice(4, 5)
      });
    },
    dragEnd() {
      // when dragging ends, remove all droppable highlghting
      this.toggleDroppable(false);
    },
    dragOver(e) {
      // when dragging over a droppable, change color for confirmation
      e.target.classList.toggle("drag-hover");
    },
    onDrop(e, dayIndex) {
      this.toggleDroppable(false);
      const meal = JSON.parse(e.dataTransfer.getData("meal"));
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
  position: relative;
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
