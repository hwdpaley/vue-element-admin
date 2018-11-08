<template>
  <div>
    <div style="width: 100%; float: left; margin-top: 100px; text-align: center;">
      <div style="width: 47%; color: #000000; text-align: right; float: left; font-family: 黑体; font-size: 26px;">
        新手上路&nbsp;
      </div>
      <div style="width: 53%; color: #898989; font-size: 22px; font-family: Arial; margin-top: 2px; text-align: left; float: left;">
        Novice on the road
      </div>
    </div>
    <div style="width: 100%; text-align: center; margin-top: 100px; height: 37px; float: left;">
      <!-- <el-table
          ref="multipleTable"
          v-loading="loading"
          :key="tableKey"
          :data="users"
          border
          fit
          style="width: 1100px"
          >
          <el-table-column label="用户头像" align="center" width="160">
            <img src="../../assets/xssl/meifa-shouye_17.png" alt="" class="timg">
          </el-table-column>
        </el-table> -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="1100px">
        <tr>
          <td style="width: 160px; border: 1px solid #ffffff; text-align: center; padding-left: 23px;">
            <router-link class="xssl_01" to="/setup/groups">
              <img src="../../assets/xssl/meifa-shouye_17.png" >
            </router-link>
          </td>
          <td style="width: 173px; text-align: center; padding-left: 10px;">
            <router-link class="xssl_02" to="/setup/groups">
              <img src="../../assets/xssl/meifa-shouye_19.png" >
            </router-link>
          </td>
          <td style="width: 163px; text-align: center; padding-right: 20px;">
            <a class="xssl_03" href="javascript:void(0)">
              <img src="../../assets/xssl/meifa-shouye_21.png" >
            </a>
          </td>
          <td style="width: 143px; text-align: center; padding-right: 40px;">
            <a class="xssl_04" href="javascript:void(0)">
              <img src="../../assets/xssl/meifa-shouye_23.png" >
            </a>
          </td>
          <td style="width: 123px; text-align: center; padding-right: 60px;">
            <a class="xssl_05" href="javascript:void(0)">
              <img src="../../assets/xssl/meifa-shouye_25.png" >
            </a>
          </td>
          <td style="width: 123px; text-align: center; padding-right: 60px;">
            <a class="xssl_06" href="javascript:void(0)">
              <img src="../../assets/xssl/meifa-shouye_28.png" >
            </a>
          </td>
        </tr>
        <tr>
          <td colspan="6" style="width: 1100px; height: 37px; vertical-align: top;">
            <img src="../../assets/xssl/meifa-shouye_37.png" >
          </td>
        </tr>
        <tr style="font-size: 20px; color: #419ed9; font-family: 黑体;">
          <td style="width: 160px; text-align: center; padding-left: 23px;">
            <router-link class="xssl_01" to="/setup/groups">
              <span style="color: #419ed9;">门店管理</span>
            </router-link>
          </td>
          <td style="width: 173px; text-align: center; padding-left: 10px;">
            <a class="xssl_02" href="javascript:void(0)">
              <span style="color: #419ed9;">员工管理</span>
            </a>
          </td>
          <td style="width: 163px; text-align: center; padding-right: 20px;">
            <a class="xssl_03" href="javascript:void(0)">
              <span style="color: #419ed9;">服务项目</span>
            </a>
          </td>
          <td style="width: 143px; text-align: center; padding-right: 40px;">
            <a class="xssl_04" href="javascript:void(0)">
              <span style="color: #419ed9;">卡种设置</span>
            </a>
          </td>
          <td style="width: 123px; text-align: center; padding-right: 60px;">
            <a class="xssl_05" href="javascript:void(0)">
              <span style="color: #419ed9;">会员售卡</span>
            </a>
          </td>
          <td style="width: 123px; text-align: center; padding-right: 60px;">
            <a class="xssl_06" href="javascript:void(0)">
              <span style="color: #419ed9;">前台收银</span>
            </a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
