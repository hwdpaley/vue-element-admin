<template>
  <div class="login-container">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>

      <!-- <div class="tips">
        <span>{{ $t('login.username') }} : admin</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
        <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
      </div> -->

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{ $t('login.thirdparty') }}</el-button>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { isvalidUsername } from "@/utils/validate";
import LangSelect from "@/components/LangSelect";
import SocialSign from "./socialsignin";
// import { setToken } from "@/utils/auth";
export default {
  name: "Login",
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正常的用户名称"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error("密码最少必须2个数字"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  computed: {
    ...mapState("auth", { user: "payload" })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener("hashchange", this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },

  methods: {
    ...mapActions("localAuth", ["login", "logout"]),
    ...mapActions("groups", { findGroups: "find" }),
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // this.$store
          //   .dispatch("LoginByUsername", this.loginForm)
          this.login({ user: this.loginForm })
            .then(user => {
              // console.log("user", user);
              console.log("long vue  user", user);
              if (!user.roles || user.roles.length === 0) {
                user.roles = ["admin"];
                console.log("add  user  roles", user.roles);
              }
              // console.log("login user", this.user.user);
              this.$store.dispatch("setUser", user);
              this.$store.dispatch("setGroups", user.groupId);
              // this.getAllGroups(user);
              // this.$store.dispatch("setuserToken", result.accessToken);
              // setToken(result.accessToken);
              this.loading = false;
              var sy = "/shouye";
              if (this.redirect && this.redirect !== "/404") {
                sy = this.redirect;
              }
              // console.log("shouye", this.redirect || "/shouye");
              this.$router.push({ path: sy });
            })
            .catch(err => {
              console.log("err", err);
              this.$message.error(err.message);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getAllGroups(user) {
      const allgroups = [];
      const groupsin = [];
      const gid = user.groupId;
      this.findGroups({ query: { _id: gid }}).then(myg => {
        allgroups.push({
          _id: myg.data[0]._id,
          name: myg.data[0].groupName
        });
        groupsin.push(myg.data[0]._id);
        this.findGroups({ query: { pId: gid }})
          .then(gs => {
            // this.allupgroups.push({ _id: "1234567890", name: "顶级" });
            gs.data.forEach(item => {
              allgroups.push({ _id: item._id, name: item.groupName });
              groupsin.push(item._id);
              this.findGroups({ query: { pId: item._id }}).then(g2 => {
                g2.data.forEach(item2 => {
                  allgroups.push({
                    _id: item2._id,
                    name: item2.groupName
                  });
                  groupsin.push(item2._id);
                });
              });
            });
            console.log("groupsin", groupsin);
            console.log("allgroups", allgroups);
            this.$store.dispatch("setGroups", {
              groupsin: groupsin,
              allgroups: allgroups
            });
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1);
      // const hashObj = getQueryObject(hash);
      // const originUrl = window.location.origin;
      // history.replaceState({}, "", originUrl);
      // const codeMap = {
      //   wechat: "code",
      //   tencent: "code"
      // };
      // const codeName = hashObj[codeMap[this.auth_type]];
      // if (!codeName) {
      //   alert("第三方登录失败");
      // } else {
      //   this.$store.dispatch("LoginByThirdparty", codeName).then(() => {
      //     this.$router.push({ path: "/" });
      //   });
      // }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    // bottom: 28px;
  }
}
</style>
