<template>
  <div class="footer">
    <div v-for="link in links" :key="link.path" class="link">
      <router-link :to="link.path">
        <div class="link-inner">
          <i class="material-icons">{{ link.icon }}</i>
          <br />
          {{ link.name }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import links from "@/assets/links.json";
export default {
  setup() {
    return {
      links
    };
  }
};
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: green;
  height: 100%;
}

.link {
  flex: 0 0 32%;
  font-size: 0.75rem;
  color: #fff;
  padding: 6px;

  a,
  a:hover,
  a:visited {
    text-decoration: none;
    color: #fff;

    &.router-link-exact-active {
      height: 100%;
      width: 100%;

      .link-inner {
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.4);
        padding: 0 12px;
      }
    }
  }
}
</style>
