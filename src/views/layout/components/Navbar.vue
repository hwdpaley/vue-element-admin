<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <!-- <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip> -->

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip> -->

        <!-- <lang-select class="international right-menu-item"/>

        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip> -->
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <!-- -->

        <div class="avatar-wrapper">
          <div class="showname">
            <span >{{ uname }}</span>
          </div>
          <img :src="imgurl+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <!-- </div> -->
        <el-dropdown-menu slot="dropdown">
          <router-link to="/shouye">
            <el-dropdown-item>
              {{ $t('route.shouye') }}
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      imgurl: "",
      uname: ""
    };
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapGetters(["sidebar", "name", "avatar", "device"])
  },
  mounted() {
    this.uname = this.user.user.displayName ? this.user.user.displayName : "no";
    this.imgurl = this.user.user.imageUrl
      ? this.user.user.imageUrl
      : "http://image.gzxinbibo.com/meimeilogo.png";
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.authLogout().then(() => this.$router.push("/login"));
      // this.authLogout();
      // location.reload();
      // this.$store.dispatch("LogOut").then(() => {
      //   this.authLogout();
      //   location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      // });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        cursor: pointer;
        margin-top: 10px;
        margin-right: 20px;
        position: relative;

        .user-avatar {
          // .showname {
          //   line-height: 30px;
          // }
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-left: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
