<template>
  <div class="root">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/meals">Browse Meals</router-link> |
      <router-link to="/week">This Week</router-link> |
      <router-link to="/shopping">Shopping List</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div class="app-main">
      <router-view />
    </div>
    <div class="app-footer">
      <footerbar />
    </div>
  </div>
</template>
<script>
import footerbar from "@/components/Footer";
export default {
  components: { footerbar }
};
</script>
<style lang="scss">
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
.nav {
  flex: 1 1 48px;
}
.app-main {
  flex: 1 1 auto;
  overflow: auto;
}
.app-footer {
  flex: 0 0 60px;
  border-top: 2px lightgreen solid;
  background: #cfc6c6;
  overflow: hidden;
}
</style>
