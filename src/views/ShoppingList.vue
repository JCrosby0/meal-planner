<template>
  <div class="base-shopping-list">
    <h2>Shopping List</h2>
    <!-- Ingredients: {{ ingredients }} -->
    <div class="sort-methods">
      <span class="sort-item">Sort by:</span>
      <div v-for="(method, i) in sortBy" :key="method + i" class="sort-item">
        <label :for="method">{{ method }}</label>
        <input
          :id="method"
          v-model="sortSelected"
          type="radio"
          name="sortMethod"
          :value="method"
        />
      </div>
      <span class="sort-item">Completed at bottom:</span>
      <input id="completed" v-model="sortCompleted" type="checkbox" />
    </div>
    <div class="add-item">
      <input
        v-model="addItem"
        class="input-box"
        placeholder="Add Item to List"
      />
      <i class="material-icons add-item-button" @click="addToShoppingList"
        >add</i
      >
    </div>
    <div class="shopping-list">
      <div v-for="item in ingredients" :key="item" class="shopping-item">
        <span class="label">{{ item.name }}</span>
        <!-- display item location if sort method is 2 or 3 -->
        <span v-if="sortBy.slice(2, 4).includes(sortSelected)" class="location">
          {{ itemLocation(item) }}
        </span>
        <span v-if="sortBy[1] === sortSelected" class="location">
          {{ item.nameAdult }}
        </span>
        <input type="checkbox" class="check-box" :value="item.checked" />
      </div>
    </div>
    <ul>
      <li>Sort checked to bottom of list</li>
    </ul>
  </div>
</template>

<script>
import meals from "@/assets/meals.json";
import sorting from "@/assets/ingredient-locations.json";
import { useStore } from "../store";
import { computed, ref } from "vue";
const sortOptions = ["A->Z", "Meal", "Home", "Woolies"];
const sortByCategories = (a, b, sortSelected, sortCompleted) => {
  let aIndex;
  let bIndex;
  let order;
  // if sorting by home or Woolies, sort by index in the combined array
  if ([sortOptions[2], sortOptions[3]].includes(sortSelected.value)) {
    order = sorting[sortSelected.value].reduce(
      (acc, cur) => [...acc, ...cur.ingredients.sort()],
      []
    );
    aIndex = order.indexOf(a.name);
    bIndex = order.indexOf(b.name);
  }
  // if sortCompleted = true, primary sort priority is by checked status.
  if (sortCompleted) {
    if (a.checked && !b.checked) return 1;
    if (!a.checked && b.checked) return -1;
  }
  // if both have same status, it will go through to other sort priority
  switch (sortSelected.value) {
    case sortOptions[2]: // Home
    case sortOptions[3]: // Woolies
      return aIndex >= bIndex ? 1 : -1;
    case sortOptions[0]: // Alphabetical
      return a.name >= b.name ? 1 : -1;
    case sortOptions[1]: // Meal
    default:
      return 0; // None
  }
};
export default {
  setup() {
    const sortBy = sortOptions;
    const sortSelected = ref("A->Z");
    const sortCompleted = ref(false);
    const addItem = ref(undefined);
    const store = useStore();
    const assignedMeals = computed(() => {
      const arrIds = store.state.assignedMeals.filter(m => m);
      return meals.filter(m => arrIds.includes(m.mealId));
    });
    const ingredients = computed(() => {
      const arrIds = store.state.assignedMeals.filter(m => m);
      return meals
        .filter(m => arrIds.includes(m.mealId))
        .reduce((acc, meal) => {
          return [
            ...acc,
            ...meal.ingredients.map(i => {
              return {
                name: i,
                checked: false,
                nameAdult: meal.nameAdult
              };
            })
          ];
        }, [])
        .sort((a, b) => sortByCategories(a, b, sortSelected, sortCompleted));
    });

    return {
      assignedMeals,
      ingredients,
      sortBy,
      sortSelected,
      sortCompleted,
      addItem
    };
  },
  methods: {
    addToShoppingList() {
      const payload = {
        nameAdult: this.addItem,
        location: "manually added",
        id: undefined
      };
      this.store.dispatch("AddItemToShoppingList", payload);
    },
    itemLocation(item) {
      if (this.sortSelected === "None") return "somewhere";
      let location = "somewhere";
      sorting[this.sortSelected].some(storage => {
        if (storage.ingredients.includes(item.name)) {
          location = storage.location;
          return true;
        } else {
          location = "not found";
          return false;
        }
      });
      return location;
    }
  }
};
</script>

<style scoped>
.shopping-list {
  display: flex;
  flex-direction: column;
}
.sort-methods {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.sort-item {
  padding: 6px 12px;
}
.shopping-item {
  border: 1px grey solid;
  background: #eeffee;
  font-size: 1.5rem;
  padding: 6px 12px;
  width: 50%;
  min-width: 250px;
  margin: 3px auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.label {
  text-align: left;
  padding-right: 12px;
}
.location {
  font-size: 1rem;
  flex: 1 1 auto;
  text-align: right;
  padding-right: 12px;
  font-style: italic;
}
.check-box {
  padding: 6px;
  /* font-size: 18px; */
  width: 1.5rem;
  height: 1.5rem;
}
.add-item {
  display: flex;
  margin: 3px auto;
  flex-direction: row;
  width: 50%;
  min-width: 250px;
  padding: 6px;
}
.input-box {
  font-size: 1.5rem;
  flex: 1 1 50%;
  padding: 6px 12px;
  /* box-sizing: border-box; */
}
.input-box::placeholder {
  color: grey;
  font-style: italic;
  font-size: 1.25rem;
}
.add-item-button {
  flex: 0 0 44px;
  height: 44px;
  font-size: 44px;
  background: green;
  color: white;
}
</style>
