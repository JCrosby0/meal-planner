import sorting from "@/assets/ingredient-locations.json";
export const SortOptions = ["A->Z", "Meal", "Home", "Woolies"];
export const SortByCategories = (
  a,
  b,
  sortSelected,
  sortCompleted,
  sortOptions
) => {
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
    console.log("sortCompleted: ", sortCompleted);
    console.log(a.checked, b.checked);
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
