<template>
  <div class="base" :class="{ placeholder: isPlaceholder }">
    <i v-if="!isPlaceholder" class="material-icons drag">drag_indicator</i>
    <span v-if="name" class="text">{{ name }}</span>
    <i v-if="!isPlaceholder" class="material-icons close" @click="removeMeal"
      >close</i
    >
  </div>
</template>

<script>
const phText = "Drag a meal here";
import { computed } from "vue";
export default {
  props: {
    name: {
      type: String || Boolean,
      required: false,
      default: () => phText
    },
    mealId: {
      type: Number,
      required: false,
      default: () => -1
    }
  },
  setup(props) {
    const isPlaceholder = computed(() => props.name === phText);
    return {
      isPlaceholder
    };
  },
  methods: {
    removeMeal(meal, payload) {
      if (!meal) return;
      console.log("remove meal: ", meal, payload);
      this.$store.dispatch("toggleMealId", this.mealId);
    }
    // removeMeal() {
    //   this.$emit("remove", this.name);
    // }
  }
  // the "rest" of the component
};
</script>

<style scoped>
.base {
  width: 200px;
  padding: 12px 24px;
  border: 1px grey solid;
  border-radius: 6px;
  background: #efffef;
  margin: 6px auto;
  position: relative;
  cursor: grab;
  user-select: none;
}
.placeholder {
  border: 1px grey dashed;
  background: none;
  padding: 12px;
  cursor: not-allowed;
}
i {
  position: absolute;
  font-size: 18px;
  top: 50%;
  transform: translate(0, -50%);
}
.close {
  right: 6px;
  color: red;
  cursor: pointer;
}
.drag {
  left: 6px;
}
</style>
