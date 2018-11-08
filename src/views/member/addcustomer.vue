<template>
  <div class="app-container">

    <!-- <pre>{{ groups }}</pre>
    <pre>{{ user }}</pre> -->
    <div class="add">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="170px" style="width: 400px; margin-left:40%;margin-top:100px">
        <el-form-item label="客户名称" prop="name" >
          <el-input v-model="temp.name" placeholder="客户名称"/>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone" >
          <el-input v-model="temp.phone" placeholder="客户电话"/>
        </el-form-item>
        <el-form-item label="客户头像" prop="imageUrl" >
          <el-input v-model="temp.imageUrl" placeholder="客户头像"/>
        </el-form-item>

        <!-- <el-form-item label="上级路由" prop="pId">
          <el-select v-model="temp.pId" class="filter-item" placeholder="请选择上级菜单">
            <el-option v-for="item in allTopMenus" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="客户性别">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择性别" >
            <el-option v-for="item in sexData" :key="item.key" :label="item.name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户生日" prop="birthDay">
          <el-date-picker v-model="temp.birthDay" type="date" placeholder="请输入生日日期"/>
        </el-form-item>
        <el-form-item label="介绍人" prop="jieshaoId">
          <el-select v-model="temp.jieshaoId" class="filter-item" placeholder="请选择介绍人">
            <el-option v-for="item in jieshaos" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="客户经理" prop="managerId">
          <el-select v-model="temp.managerId" class="filter-item" placeholder="请选择客户经理">
            <el-option v-for="item in jieshaos" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop="groupId">
          <el-select v-model="temp.groupId" class="filter-item" placeholder="请选择所属门店">
            <el-option v-for="item in allgroups" :key="item._id" :label="item.name" :value="item._id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="备注"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeself">返回</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
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

export default {
  name: "AddCustomerTable",
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
      sexData: [{ key: 1, name: "女" }, { key: 0, name: "男" }],
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
        name: ""
      },

      temp: {
        id: undefined,
        name: "",
        phone: "",
        imageUrl: ""
      },
      jieshaos: [],
      allTopMenus: [],
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
    ...mapState("roles", {
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
    this.getAllGroups();
    // this.getJieshaos();
    this.dialogStatus = "create";
    const id = this.$route.params._id;

    // this.getLists();
  },
  // mounted() {
  //   this.getList();
  // },
  methods: {
    ...mapActions("users", { findUsers: "find", updateUsers: "update" }),
    ...mapActions("groups", { findGroups: "find" }),
    ...mapActions("customers", { findCustomers: "find" }),
    closeself() {
      this.$router.push({ name: "CustomerTable" });
    },
    getById(id) {
      const query = { _id: id, groupId: this.$route.params.groupId };
      console.log("getById", query);

      this.findCustomers({
        query: query
      }).then(g => {
        console.log("Customers=", g.data);

        this.temp = g.data[0];
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
      // if (this.listQuery.pId && this.listQuery.pId.length > 0) {
      //   query.pId = this.listQuery.pId;
      // }
      query.groupId = { $in: this.groupsin };
      console.log("query", query);
      this.listQuery.name = "";
      this.listQuery.desc = "";
      this.findRoles({
        query: query
      })
        .then(gs => {
          console.log(gs);
          this.list = gs.data;
          // this.list.forEach(item => {
          //   this.allTopMenus.some(ite => {
          //     if (ite._id === item.pId) {
          //       item.routeUpName = ite.name;
          //       return;
          //     }
          //   });
          // });
          this.total = gs.total;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getJieshaos() {
      this.findUsers({ query: { groupId: { $in: this.groupsin }}}).then(g => {
        g.data.forEach(item => {
          this.jieshaos.push({ _id: item._id, name: item.displayName });
        });
        console.log("this.jieshaos", this.jieshaos);
        if (this.$route.params._id) {
          console.log("this.$route.params._id=", this.$route.params._id);
          this.getById(this.$route.params._id);
          this.dialogStatus = "update";
        }
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
        imageUrl: "",
        phone: ""
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
      console.log("this.temp", this.temp);
      if (this.temp.groupId.length < 1) {
        this.temp.groupId = this.user.user.groupId;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          // this.temp.author = "vue-element-admin";
          service
            .service(TOPIC)
            .create(this.temp)
            .then(g => {
              console.log("ok", g);

              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 2000
              });
              this.closeself();
            });
        }
      });
    },
    // async createUserData() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
    //       // async createBoard (board) {
    //       const { User } = this.$FeathersVuex;
    //       // delete this.usertemp.pId;
    //       console.log(this.usertemp);

    //       const newUser = new User(this.usertemp);
    //       newUser
    //         .save()
    //         .then(result => {
    //           this.dialogFormVisible = false;
    //           this.$notify({
    //             title: "成功",
    //             message: "创建用户成功",
    //             type: "success",
    //             duration: 2000
    //           });
    //           this.getLists();
    //         })
    //         .catch(err => {
    //           this.$notify({
    //             title: "失败",
    //             message: err.message,
    //             type: "fail",
    //             duration: 2000
    //           });
    //         });
    //       // };
    //       // this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
    //       // this.temp.author = "vue-element-admin";
    //       // createArticle(this.temp).then(() => {
    //       // this.list.unshift(this.usertemp);
    //     }
    //   });
    // },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

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
              this.closeself();
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
.add {
  text-align: center;
}
</style>
