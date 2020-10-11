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
  flex: 0 0 33%;
  font-size: 0.75rem;
  color: #fff;
  padding: 6px;
  box-sizing: border-box;
  .link-inner {
    border-radius: 12px;
    height: 100%;
    margin: auto;
    padding: 3px;
    box-sizing: border-box;
  }
  a,
  a:hover,
  a:visited {
    text-decoration: none;
    color: #fff;

    &.router-link-exact-active {
      .link-inner {
        background: rgba(255, 255, 255, 0.4);
      }
    }
  }
}
</style>
