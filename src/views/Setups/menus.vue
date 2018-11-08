<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" style="width: 200px;" class="filter-item" placeholder="菜单名称" @keyup.enter.native="handleFilter"/>
      <!-- <el-input placeholder="电话" v-model="listQuery.phone" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/> -->
      <!-- <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> -->
      <!-- <el-select v-model="listQuery.groupId" placeholder="所属门店" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in allMyGroups" :key="item._id" :label="item.name" :value="item._id"/>
      </el-select> -->
      <el-select v-model="listQuery.pId" placeholder="上级菜单" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in allTopMenus" :key="item._id" :label="item.name" :value="item._id"/>
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
      <el-table-column label="排序" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="菜单名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="门店地址" min-width="150px" align="center">
        <template slot-scope="scope">
          <span  >{{ scope.row.address }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="菜单路由" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.route }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="显示名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span  >{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" min-width="150px" align="center">
        <template slot-scope="scope">
          <span  >{{ scope.row.roleName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属上级菜单" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.routeUpName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.author')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="$t('table.importance')" width="80px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="$t('table.readings')" align="center" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.pageviews" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>-->
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
    <!-- <pre>{{ groups }}</pre>
    <pre>{{ user }}</pre> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="margin-top: 5vh;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="170px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单名称" prop="name" >
          <el-input v-model="temp.name" placeholder="菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路由" prop="route" >
          <el-input v-model="temp.route" placeholder="菜单路由"/>
        </el-form-item>

        <el-form-item label="上级菜单" prop="pId">
          <el-select v-model="temp.pId" class="filter-item" placeholder="请选择上级菜单">
            <el-option v-for="item in allTopMenus" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort" >
          <el-input v-model="temp.sort" placeholder="菜单排序"/>
        </el-form-item>
        <!-- <el-form-item label="所属门店">
          <el-select v-model="temp.groupId" class="filter-item" placeholder="请选择所属门店">
            <el-option v-for="item in allgroups" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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

// const userRoleOptions = [
//   { key: "admin", rolename: "超级管理员" },
//   { key: "mdadmin", rolename: "门店管理员" },
//   { key: "mduser", rolename: "门店员工" },
//   { key: "mdboss", rolename: "门店老板" }
// ];

export default {
  name: "MenusTable",
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
        update: "编辑菜单",
        create: "创建菜单"
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
        pId: "",
        $sort: { sort: 1 }
      },

      temp: {
        id: undefined,
        name: "",
        route: ""
      },
      allTopMenus: [],
      // allMyGroups: [],
      // importanceOptions: [1, 2, 3],
      // userRoleOptions,
      // sortOptions: [
      //   { label: "ID Ascending", key: "+id" },
      //   { label: "ID Descending", key: "-id" }
      // ],
      // statusOptions: ["published", "draft", "deleted"],
      // showReviewer: false,

      // dialogPvVisible: false,
      pvData: [],
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
    // ...mapState("groups", {
    //   grouploading: "isFindPending"
    // }),
    ...mapState("menus", {
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
    this.getAllTopMenus();
    // this.getAllMyGroups();
    // this.getLists();
  },
  // mounted() {
  //   this.getList();
  // },
  methods: {
    ...mapActions("users", { findUsers: "find", updateUsers: "update" }),
    ...mapActions("groups", { findGroups: "find" }),
    ...mapActions("menus", { findMenus: "find" }),

    getLists() {
      const query = {
        $limit: this.listQuery.$limit,
        $skip: this.listQuery.$skip,
        $sort: { sort: 1 }
      };
      query.groupId = this.user.user.groupId;
      if (this.listQuery.name && this.listQuery.name.length > 0) {
        query.name = { $search: this.listQuery.name };
      }
      if (this.listQuery.pId && this.listQuery.pId.length > 0) {
        query.pId = this.listQuery.pId;
      }
      console.log("query", query);
      this.listQuery.name = "";
      this.listQuery.pId = "";
      this.findMenus({
        query: query
      })
        .then(gs => {
          console.log(gs);
          gs.data.forEach(item => {
            this.allTopMenus.some(ite => {
              if (ite._id === item.pId) {
                item.routeUpName = ite.name;
                return;
              }
            });
          });
          this.list = gs.data;
          this.total = gs.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getAllTopMenus() {
      const query = {
        $limit: this.listQuery.$limit,
        $skip: this.listQuery.$skip,
        // groupId: this.user.user.groupId,
        pId: null
      };
      this.findMenus({ query: query })
        .then(gs => {
          // const groups = gs.data;
          this.allTopMenus = gs.data;
          this.allTopMenus.unshift({ _id: null, name: "顶级" });
          console.log(this.allTopMenus);
          this.getLists();
          // groups.forEach(item => {
          //   const g = { _id: item._id, name: item.name };
          //   this.allgroups.push(g);
          // });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // getAllMyGroups() {
    //   const query = {
    //     $limit: 50,
    //     $skip: 0,
    //     pId: this.user.user.groupId
    //   };
    //   this.findGroups({ query: query })
    //     .then(gs => {
    //       // const groups = gs.data;
    //       this.allMyGroups = gs.data;
    //       // this.allTopMenus.unshift({ _id: null, name: "顶级" });
    //       console.log("this.allMyGroups", this.allMyGroups);

    //       // groups.forEach(item => {
    //       //   const g = { _id: item._id, name: item.name };
    //       //   this.allgroups.push(g);
    //       // });
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message);
    //     });
    // },
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
        pId: null,
        name: "",
        route: ""
        // groupId: this.user.user.groupId
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          service
            .service("menus")
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
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
            .service("menus")
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
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          service
            .service("menus")
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
</style>
