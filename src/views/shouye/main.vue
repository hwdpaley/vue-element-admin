<template>
  <div>
    <el-row class="mt">
      <el-col :span="6" :offset="1">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img src="../../assets/main/htsy_03.png" class="image">
        </el-card>
        <div class="wz">
          <div>
            <span class="time">会员:0</span>
          </div >
          <div style="margin-top:10px;">
            <span class="time">散客:0</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img src="../../assets/main/htsy_05.png" class="image">
        </el-card>
        <div class="wz1">
          <div>
            <span class="time">今日营业额:0</span>
          </div >
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img src="../../assets/main/htsy_08.png" class="image">
        </el-card>
        <div class="wz">
          <div>
            <span class="time">0条提醒</span>
          </div >

        </div>
      </el-col>
    </el-row>
    <el-row class="mt">
      <el-col :span="6" :offset="1" >
        <el-card :body-style="{ padding: '0px' }" >
          <img src="../../assets/main/htsy_15.png" class="image" @click="htsy15">
        </el-card>
        <div class="wz">
          <div>
            <span class="time">会员总数:300</span>
          </div >
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img src="../../assets/main/htsy_13.png" class="image">
        </el-card>
        <div class="wz1">
          <div>
            <span class="time">会员报表:0</span>
          </div >
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img src="../../assets/main/htsy_17.png" class="image">
        </el-card>
        <!-- <div class="wz">
          <div>
            <span class="time">会员:0</span>
          </div >
          <div style="margin-top:10px;">
            <span class="time">散客:0</span>
          </div>
        </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date()
    };
  },
  methods: {
    htsy15() {
      this.$router.push({ name: "Setup" });
      // console.log("9999");
    }
  }
};
</script>

<style>
.wz {
  margin-top: -70px;
  margin-left: 200px;
  line-height: 12px;
  position: relative;
}
.wz1 {
  margin-top: -70px;
  margin-left: 50px;
  line-height: 12px;
  position: relative;
}
.mt {
  margin-top: 80px;
}
.time {
  margin-top: 10px;
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

