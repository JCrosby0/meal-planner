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
        v-model="itemToAdd"
        class="input-box"
        placeholder="Add Item to List"
        @keyup.enter="addToShoppingList"
      />
      <i class="material-icons add-item-button" @click="addToShoppingList"
        >add</i
      >
    </div>
    <!-- show error message if adding something that's already on the list -->
    <div v-show="showErrorMessage" class="error-message">
      <span>{{ errorMessage }}</span>
    </div>
    <div class="shopping-list">
      <div
        v-for="(item, index) in shoppingList"
        :key="item"
        class="shopping-item"
        @click.capture="toggleChecked($event, item, index)"
      >
        <span class="label">{{ item.name }}</span>
        <!-- display item location if sort method is 2 or 3 -->
        <span v-if="sortBy.slice(2, 4).includes(sortSelected)" class="location">
          {{ itemLocation(item) }}
        </span>
        <span v-if="sortBy[1] === sortSelected" class="location">
          {{ item.nameAdult }}
        </span>
        <input
          v-model="item.checked"
          type="checkbox"
          class="check-box"
          @input="toggleChecked($event, item, index)"
        />
      </div>
    </div>
    <ul></ul>
  </div>
</template>

<script>
// import meals from "@/assets/meals.json";
import sorting from "@/assets/ingredient-locations.json";
import { useStore } from "../store";
import { computed, ref } from "vue";
import { SortOptions, SortByCategories } from "@/assets/js/shoppingListSort";

export default {
  setup() {
    const sortBy = SortOptions;
    const sortSelected = ref("A->Z");
    const sortCompleted = ref(true);
    const itemToAdd = ref(undefined);
    const showErrorMessage = ref(false);
    const errorMessage = ref("");
    const store = useStore();
    const shoppingList = computed(() => {
      return store.getters.shoppingList.sort((a, b) =>
        SortByCategories(
          a,
          b,
          sortSelected.value,
          sortCompleted.value,
          SortOptions
        )
      );
    });
    return {
      sortBy,
      sortSelected,
      sortCompleted,
      itemToAdd,
      shoppingList,
      showErrorMessage,
      errorMessage
    };
  },
  methods: {
    addToShoppingList() {
      this.showErrorMessage = false;
      if (!this.itemToAdd) return;
      const payload = {
        name: this.itemToAdd,
        ingredient: this.itemToAdd,
        nameAdult: "Individual Item",
        meal: "Individual Item",
        id: undefined,
        checked: false
      };
      this.$store.dispatch("AddItemToShoppingList", payload).catch(err => {
        this.errorMessage = err.message;
        this.showErrorMessage = true;
      });
      this.itemToAdd = undefined;
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
    },
    toggleChecked(event, item) {
      // don't double process input box inside div, event + target combinations are
      // click + div.shopping-item
      // click + input.check-box <-- prevent this one
      // input + input.check-box
      if (event.type === "click" && event.target.nodeName === "INPUT") return;
      this.$store.dispatch("ToggleIngredientChecked", {
        meal: item.meal,
        ingredient: item.name,
        status: event.returnValue
      });
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
.error-message {
  color: red;
}
</style>
