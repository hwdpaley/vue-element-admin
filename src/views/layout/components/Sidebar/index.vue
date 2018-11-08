<template>
  <div class="slider-container">

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="myimg">
        <img
          :class="isCollapse?'small':'large'"
          src="http://image.gzxinbibo.com/meimeilogo.png"
          alt="">
      </div>
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    // console.log("isCollapse", this.isCollapse);
  }
};
</script>
<style lang="scss" scoped>
.slider-container {
  background-color: rgb(48, 65, 86);
  .myimg {
    height: 60px;
  }
  .small {
    margin-top: 10px;
    width: 30px;
    height: 30px;
  }
  .large {
    width: 60px;
    height: 60px;
    margin-left: 50px;
  }
}
</style>
