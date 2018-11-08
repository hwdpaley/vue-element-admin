<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="客户名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" placeholder="客户电话" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.nickname" placeholder="微信昵称" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.groupId" placeholder="所属门店" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in allgroups" :key="item._id" :label="item.name" :value="item._id"/>
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox> -->
    </div>

    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="客户头像" align="center" width="150" >
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="" class="timg">
          <!-- <img >{{  }}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="客户名称" min-width="150px" align="center" fixed>
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户性别" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.sex | sexName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日日期" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthDay | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户积分" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍人" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.jieshaoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户经理" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.managerName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所属门店" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信昵称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <!-- <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button> -->
          <!-- <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button> -->
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,15,20,30, 50]" :page-size="listQuery.$limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import service from "../../store/feathers/feathers-client";
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle,
  fetchGroups
} from "@/api/article";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";
const TOPIC = "customers";
// const userRoleOptions = [
//   { key: "admin", rolename: "超级管理员" },
//   { key: "mdadmin", rolename: "门店管理员" },
//   { key: "mduser", rolename: "门店员工" },
//   { key: "mdboss", rolename: "门店老板" }
// ];

export default {
  name: "CustomersTable",
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    sexName(sex) {
      const sexMap = {
        "1": "女",
        "0": "男"
      };
      return sexMap[sex];
    }
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type];
    // }
  },
  data() {
    return {
      downloadLoading: false,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑客户",
        create: "创建客户"
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        $skip: 0,
        $limit: 10,
        groupId: "",
        name: "",
        phone: "",
        nickname: ""
      },

      temp: {
        id: undefined,
        name: "",
        desc: ""
      },
      jieshaos: [],
      allgroups: [],
      groupsin: [],
      // importanceOptions: [1, 2, 3],
      // userRoleOptions,
      // sortOptions: [
      //   { label: "ID Ascending", key: "+id" },
      //   { label: "ID Descending", key: "-id" }
      // ],
      // statusOptions: ["published", "draft", "deleted"],
      // showReviewer: false,

      // dialogPvVisible: false,
      // pvData: [],
      rules: {
        name: [{ required: true, message: "名称需要填写", trigger: "blur" }]
        // phone: [
        //   { required: true, message: "用户电话需要填写", trigger: "blur" }
        // ]
      }
    };
  },

  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapGetters("groups", { findGroupsInStore: "find" }),
    ...mapState("customers", {
      loading: "isFindPending"
    })
    // groups() {
    //   return this.user
    //     ? this.findGroupsInStore({
    //         query: {}
    //       }).data
    //     : [];
    // }
  },
  created() {
    // this.getJieshaos();
    this.getAllGroups();
  },
  // mounted() {
  //   this.getList();
  // },
  methods: {
    ...mapActions("users", { findUsers: "find", updateUsers: "update" }),
    ...mapActions("groups", { findGroups: "find" }),
    ...mapActions("customers", { findLists: "find" }),
    getJieshaos() {
      this.findUsers({ query: { groupId: { $in: this.groupsin }}}).then(g => {
        g.data.forEach(item => {
          this.jieshaos.push({ _id: item._id, name: item.displayName });
        });
        this.getLists();
        // console.log("this.jieshaos", this.jieshaos);
        // if (this.$route.params._id) {
        //   console.log("this.$route.params._id=", this.$route.params._id);
        //   this.getById(this.$route.params._id);
        //   this.dialogStatus = "update";
        // }
      });
    },
    getLists() {
      const query = {
        $limit: this.listQuery.$limit,
        $skip: this.listQuery.$skip
      };
      // query.groupId = this.user.user.groupId;
      if (this.listQuery.name && this.listQuery.name.length > 0) {
        query.name = { $search: this.listQuery.name };
      }
      if (this.listQuery.nickname && this.listQuery.nickname.length > 0) {
        query.nickname = { $search: this.listQuery.nickname };
      }
      if (this.listQuery.phone && this.listQuery.phone.length > 0) {
        query.phone = { $search: this.listQuery.phone };
      }
      if (this.listQuery.groupId && this.listQuery.groupId.length > 0) {
        query.groupId = this.listQuery.groupId;
      } else {
        // if (this.user.user.roles.indexOf("admin") < 0) {
        //   query.groupId = this.user.user.groupId;
        // }
        query.groupId = { $in: this.groupsin };
      }
      console.log("query", query);
      this.listQuery.name = "";
      this.listQuery.nickname = "";
      this.listQuery.phone = "";
      this.findLists({
        query: query
      })
        .then(gs => {
          console.log(gs);
          this.list = gs.data;
          this.list.forEach(item => {
            this.allgroups.some(ite => {
              if (ite._id === item.groupId) {
                item.groupName = ite.name;
                return;
              }
            });
          });
          this.list.forEach(item => {
            this.jieshaos.forEach(ite => {
              if (ite._id === item.jieshaoId) {
                item.jieshaoName = ite.name;
              }
              if (ite._id === item.managerId) {
                item.managerName = ite.name;
              }
            });
          });
          this.total = gs.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getAllGroups() {
      this.allgroups = [];
      const gid = this.user.user.groupId;
      this.findGroups({ query: { _id: gid }}).then(myg => {
        this.allgroups.push({
          _id: myg.data[0]._id,
          name: myg.data[0].groupName
        });
        this.groupsin.push(myg.data[0]._id);
        this.findGroups({ query: { pId: gid }})
          .then(gs => {
            // this.allupgroups.push({ _id: "1234567890", name: "顶级" });
            gs.data.forEach(item => {
              this.allgroups.push({ _id: item._id, name: item.groupName });
              this.groupsin.push(item._id);
              this.findGroups({ query: { pId: item._id }}).then(g2 => {
                g2.data.forEach(item2 => {
                  this.allgroups.push({
                    _id: item2._id,
                    name: item2.groupName
                  });
                  this.groupsin.push(item2._id);
                });
              });
            });
            console.log("this.allgroups", this.allgroups);
            this.getJieshaos();
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      });
    },
    handleFilter() {
      this.listQuery.$skip = 0;
      console.log(this.listQuery);
      this.getLists();
    },
    handleSizeChange(val) {
      this.listQuery.$limit = val;
      this.getLists();
    },
    handleCurrentChange(val) {
      this.listQuery.$skip = (val - 1) * this.listQuery.$limit;
      console.log(this.listQuery);

      this.getLists();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        // pId: null,
        name: "",
        desc: ""
        // groupId: this.user.user.groupId
      };
    },
    handleCreate() {
      this.$router.push({ name: "AddCustomer" });
      // this.resetTemp();
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          service
            .service(TOPIC)
            .create(this.temp)
            .then(() => {
              // this.list.unshift(this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.getLists();
            });
        }
      });
    },

    handleUpdate(row) {
      this.$router.push({
        name: "EditCustomer",
        params: { _id: row._id, groupId: row.groupId }
      });
      // this.temp = Object.assign({}, row); // copy obj

      // // this.upgroups = [];
      // // this.upgroups.push({ _id: null, name: "顶级" });
      // // this.groups.forEach(item => {
      // //   const g = { _id: item._id, name: item.groupName };
      // //   if (item._id !== this.usertemp._id) {
      // //     this.upgroups.push(g);
      // //   }
      // // });
      // // console.log(this.upgroups);
      // this.dialogStatus = "update";
      // this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // if (this.usertemp.password.length < 1) {
          //   console.log("delete password");
          //   delete this.usertemp.password;
          // }
          const tempData = Object.assign({}, this.temp);
          // tempData.validDate = +new Date(tempData.validDate); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

          console.log("this.temp", tempData);
          // const id = tempData._id;
          // delete tempData._id;
          // delete tempData.phone;
          delete tempData.updatedAt;
          delete tempData.createdAt;
          service
            .service(TOPIC)
            .patch(tempData._id, tempData)
            .then(g => {
              console.log("更新 g", g);
              this.$notify({
                title: "成功",
                message: "数据更新成功",
                type: "success",
                duration: 2000
              });
              this.dialogFormVisible = false;
              this.getLists();
            });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          service
            .service(TOPIC)
            .remove(row._id)
            .then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getLists();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["门店名称", "联系电话", "地址"];
        const filterVal = ["groupName", "phone", "address"];
        const data = this.formatJson(filterVal, this.groups);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "门店表"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.eldialog {
  margin-top: 5vh;
}
.filter-container {
  text-align: center;
}
.timg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
