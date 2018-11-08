<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.groupName" style="width: 200px;" class="filter-item" placeholder="用户名称" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.phone" style="width: 100px;" class="filter-item" placeholder="电话" @keyup.enter.native="handleFilter"/>
      <!-- <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> -->
      <el-select v-model="listQuery.groupId" placeholder="所属门店" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in allgroups" :key="item._id" :label="item.name" :value="item._id"/>
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleRole">工种设置</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleOut">员工离职</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleGl">设置管理员工</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox> -->
    </div>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :key="tableKey"
      :data="users"
      :summary-method="getSummaries"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      show-summary
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="40"/>
      <el-table-column label="用户头像" align="center" width="150">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="" class="timg">
          <!-- <img >{{  }}</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户名称" min-width="150px" align="center" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="门店地址" min-width="150px" align="center">
        <template slot-scope="scope">
          <span  >{{ scope.row.address }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号" min-width="150px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="底薪" min-width="150px" align="center" prop="pay">
        <template slot-scope="scope">
          <span>{{ scope.row.pay }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称" min-width="150px" align="center" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.displayName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属门店" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      center
      top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="usertemp" label-position="left" label-width="170px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名称" prop="groupName">
          <el-input v-model="usertemp.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="usertemp.password" type="password" placeholder="不填则不会修改密码"/>
        </el-form-item>
        <el-form-item label="显示名称" prop="displayName">
          <el-input v-model="usertemp.displayName"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="usertemp.phone"/>
        </el-form-item>
        <el-form-item label="用户头像" prop="imageUrl">
          <el-input v-model="usertemp.imageUrl"/>
        </el-form-item>
        <el-form-item label="员工工号" prop="no">
          <el-input v-model="usertemp.no"/>
        </el-form-item>
        <el-form-item label="员工底薪" prop="pay">
          <el-input v-model="usertemp.pay"/>
        </el-form-item>
        <el-form-item label="用户角色" prop="roles">
          <el-select v-model="usertemp.roles" class="filter-item" multiple placeholder="请选择用户角色">
            <el-option v-for="item in userRoleOptions" :key="item.key" :label="item.rolename" :value="item.key"/>
          </el-select>
        </el-form-item>

        <el-form-item label="所属门店">
          <el-select v-model="usertemp.groupId" class="filter-item" placeholder="请选择所属门店">
            <el-option v-for="item in allgroups" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item>
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

import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";

const userRoleOptions = [
  { key: "admin", rolename: "超级管理员" },
  { key: "mdadmin", rolename: "门店管理员" },
  { key: "mduser", rolename: "门店员工" },
  { key: "mdboss", rolename: "门店老板" }
];

export default {
  name: "UsersTable",
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
      tableKey: 0,
      list: null,
      upgroups: [],
      users: [],
      total: null,
      listLoading: true,
      listQuery: {
        $skip: 0,
        $limit: 10,

        username: "",
        phone: "",
        groupId: ""
      },
      importanceOptions: [1, 2, 3],
      userRoleOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published"
      },
      usertemp: {
        groupId: null,
        userame: "",
        imageUrl: "",
        dsplayName: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑用户",
        create: "创建用户"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        username: [
          { required: true, message: "用户名称需要填写", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "用户电话需要填写", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },

  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapGetters("groups", { findGroupsInStore: "find" }),
    ...mapState("groups", {
      grouploading: "isFindPending"
    }),
    ...mapState("users", {
      loading: "isFindPending"
    }),
    allgroups() {
      return this.$store.getters.allgroups;
    },
    groupsin() {
      return this.$store.getters.groupsin;
    }
  },
  created() {
    if (this.allgroups.length == 0) {
      this.getAllGroups();
    } else {
      this.getUsers();
    }
  },
  // mounted() {
  //   this.getList();
  // },
  methods: {
    ...mapActions("users", { findUsers: "find", updateUsers: "update" }),
    ...mapActions("groups", { findGroups: "find" }),
    getAllGroups() {
      const allgroups = [];
      const groupsin = [];
      const gid = this.$store.getters.user.groupId;
      service
        .service("groups")
        .find({ query: { _id: gid }})
        .then(myg => {
          allgroups.push({
            _id: myg.data[0]._id,
            name: myg.data[0].groupName
          });
          groupsin.push(myg.data[0]._id);
          service
            .service("groups")
            .find({ query: { pId: gid }})
            .then(gs => {
              // this.allupgroups.push({ _id: "1234567890", name: "顶级" });
              gs.data.forEach(item => {
                allgroups.push({ _id: item._id, name: item.groupName });
                groupsin.push(item._id);
                service
                  .service("groups")
                  .find({ query: { pId: item._id }})
                  .then(g2 => {
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
              this.$store.dispatch("setNewGroups", {
                groupsin: groupsin,
                allgroups: allgroups
              });
              this.getUsers();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        });
    },
    getUsers() {
      const query = {
        $limit: this.listQuery.$limit,
        $skip: this.listQuery.$skip
      };
      if (this.listQuery.username && this.listQuery.username.length > 0) {
        query.username = { $search: this.listQuery.username };
      }
      if (this.listQuery.phone && this.listQuery.phone.length > 0) {
        query.phone = { $search: this.listQuery.phone };
      }
      if (this.listQuery.groupId && this.listQuery.groupId.length > 0) {
        query.groupId = this.listQuery.groupId;
      } else {
        query.groupId = { $in: this.groupsin };
        // if (this.user.user.roles.indexOf("admin") < 0) {
        //   query.groupId = this.user.user.groupId;
        // }
      }
      console.log("query=", query);
      this.listQuery.username = "";
      this.listQuery.phone = "";
      this.listQuery.groupId = "";
      this.findUsers({
        query: query
      })
        .then(gs => {
          console.log(gs);
          this.users = gs.data;
          this.users.forEach(item => {
            const roleName = [];
            item.roles.forEach(r => {
              this.userRoleOptions.some(ur => {
                if (r === ur.key) {
                  roleName.push(ur.rolename);
                  return;
                }
              });
            });
            item.roleName = roleName.join(",");
            this.allgroups.some(ite => {
              if (ite._id === item.groupId) {
                item.groupName = ite.name;
                return;
              }
            });
          });
          this.total = gs.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleGl() {
      // 设置管理员工
      alert("gl");
    },
    handleOut() {
      // 员工离职
      alert("out");
    },
    handleRole() {
      // 工种设置
      this.$router.push({ name: "Roles" });
    },
    handleFilter() {
      this.listQuery.$skip = 0;
      console.log(this.listQuery);

      this.getUsers();
    },
    handleSizeChange(val) {
      this.listQuery.$limit = val;
      this.getUsers();
    },
    handleCurrentChange(val) {
      this.listQuery.$skip = (val - 1) * this.listQuery.$limit;
      console.log(this.listQuery);

      this.getUsers();
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
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
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
    getSummaries(param) {
      const { columns, data } = param;
      // console.log(data);

      const sums = [];
      columns.forEach((column, index) => {
        // console.log("column", column);

        if (index === 1) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => {
          // console.log("column.property=", item[column.property]);
          return Number(item[column.property]);
        });

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    async createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // async createBoard (board) {
          const { User } = this.$FeathersVuex;
          // delete this.usertemp.pId;
          console.log(this.usertemp);

          const newUser = new User(this.usertemp);
          newUser
            .save()
            .then(result => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建用户成功",
                type: "success",
                duration: 2000
              });
              this.getUsers();
            })
            .catch(err => {
              this.$notify({
                title: "失败",
                message: err.message,
                type: "fail",
                duration: 2000
              });
            });
          // };
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          // createArticle(this.temp).then(() => {
          // this.list.unshift(this.usertemp);
        }
      });
    },
    handleUpdate(row) {
      delete row.password;
      this.usertemp = Object.assign({}, row); // copy obj

      // this.upgroups = [];
      // this.upgroups.push({ _id: null, name: "顶级" });
      // this.groups.forEach(item => {
      //   const g = { _id: item._id, name: item.groupName };
      //   if (item._id !== this.usertemp._id) {
      //     this.upgroups.push(g);
      //   }
      // });
      // console.log(this.upgroups);
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
          const tempData = Object.assign({}, this.usertemp);
          // tempData.validDate = +new Date(tempData.validDate); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // const { User } = this.$FeathersVuex;
          // const newUser = new User(tempData);
          delete tempData.roleName;
          delete this.usertemp.roleName;

          if (this.usertemp.password && this.usertemp.password.length < 1) {
            console.log("delete password");
            delete tempData.password;
          }
          console.log("this.usertemp", tempData);
          // const id = tempData._id;
          // delete tempData._id;
          // delete tempData.phone;
          delete tempData.updatedAt;
          delete tempData.createdAt;
          service
            .service("users")
            .patch(tempData._id, tempData)
            .then(g => {
              console.log("g", g);
              this.$notify({
                title: "成功",
                message: "用户更新成功",
                type: "success",
                duration: 2000
              });
              this.dialogFormVisible = false;
              this.getUsers();
            });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          service
            .service("users")
            .remove(row._id)
            .then(() => {
              this.$notify({
                title: "成功",
                message: "删除成功",
                type: "success",
                duration: 2000
              });
              this.getUsers();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData;
    //     this.dialogPvVisible = true;
    //   });
    // },
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
// .el-dialog {
//   margin-top: 5vh !important;
// }

.filter-container {
  text-align: center;
}
.timg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
