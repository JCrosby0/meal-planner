<template>
  <div class="meal-card">
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
      <div class="button">
        <i class="material-icons" @click="addMeal(mealObj)">add</i>
      </div>
    </div>
  </div>
</template>

<script>
import meals from "@/assets/meals.json";
export default {
  props: {
    mealId: { type: Number, required: true }
  },
  setup(props) {
    const mealObj = meals.find(m => m.mealId === props.mealId);
    return {
      mealObj
    }; // anything returned here will be available for the rest of the component
  },
  // the "rest" of the component
  methods: {
    getImgUrl(pic) {
      console.log("pic: ", pic);
      return require("../assets/meals/" + pic);
    },
    addMeal(obj) {
      this.$emit("add-meal", obj);
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
  /* width: 300px; */
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
}
</style>
