<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="门店名称、电话" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!-- <el-input placeholder="门店电话" v-model="listQuery.phone" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/> -->
      <!-- <el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>
      </el-select> -->
      <el-select v-model="listQuery.pId" placeholder="上级门店" clearable class="filter-item" style="width: 130px">
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
      :data="groups"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
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
      <el-table-column label="门店名称" min-width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.groupName }}</span>
          <!-- <el-tag>{{ scope.row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="门店地址" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店电话" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公众号" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.gzhName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级门店" min-width="150px" align="center">
        <template slot-scope="scope">
          <span >{{ scope.row.upName }}</span>
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
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10, 15,20, 30, 50]" :page-size="listQuery.$limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <!-- <pre>{{ groups }}</pre>
    <pre>{{ user }}</pre> -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      center
      top="5vh">
      <el-form ref="dataForm" :rules="rules" :model="grouptemp" label-position="left" label-width="170px" style="width: 400px; margin-left:50px;">
        <el-form-item label="门店名称" prop="groupName">
          <el-input v-model="grouptemp.groupName"/>
        </el-form-item>
        <el-form-item label="门店地址" prop="address" >
          <el-input v-model="grouptemp.address" type="textarea" />
        </el-form-item>
        <el-form-item label="门店电话" prop="phone">
          <el-input v-model="grouptemp.phone"/>
        </el-form-item>
        <el-form-item label="门店图片" prop="imageUrl">
          <el-input v-model="grouptemp.imageUrl"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="grouptemp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="到期时间" prop="validDate">
          <el-date-picker v-model="grouptemp.validDate" type="date" placeholder="请输入到期日前"/>
        </el-form-item>
        <el-form-item label="门店AppId" prop="appId">
          <el-input v-model="grouptemp.appId"/>
        </el-form-item>
        <el-form-item label="公众号名称" prop="gzhName">
          <el-input v-model="grouptemp.gzhName"/>
        </el-form-item>
        <el-form-item label="公众号商户号" prop="mchId">
          <el-input v-model="grouptemp.mchId"/>
        </el-form-item>
        <el-form-item label="公众号AppSecret" prop="appSecret">
          <el-input v-model="grouptemp.appSecret"/>
        </el-form-item>
        <el-form-item label="上级门店">
          <el-select v-model="grouptemp.pId" class="filter-item" placeholder="Please select">
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import service from "../../store/feathers/feathers-client";
import {
  // fetchList,
  fetchPv
  // createArticle,
  // updateArticle,
  // fetchGroups
} from "@/api/article";
import waves from "@/directive/waves"; // 水波纹指令
import { parseTime } from "@/utils";

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "GroupsTable",
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
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      upgroups: [],
      allupgroups: [],
      groups: [],
      // groupsin: [],
      total: null,
      listLoading: true,
      listQuery: {
        $skip: 0,
        $limit: 10,

        name: "",
        pId: ""
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
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
      grouptemp: {
        pId: null,
        groupName: "",
        imageUrl: "",
        validDate: new Date(),
        appId: "",
        mchId: "",
        address: "",
        phone: "",
        gzhName: "",
        appSecret: "",
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑门店",
        create: "创建门店"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ],
        groupName: [
          { required: true, message: "门店名称需要填写", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "门店电话需要填写", trigger: "blur" }
        ]
      },
      downloadLoading: false
    };
  },

  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapGetters("groups", { findGroupsInStore: "find" }),
    ...mapState("groups", {
      loading: "isFindPending",
      creating: "isCreatePending"
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
      this.getGroups();
    }
  },
  // mounted() {
  //   this.getList();
  // },
  methods: {
    ...mapActions("groups", { findGroups: "find", updateGroups: "update" }),
    // ...mapActions("groups", { updateGroups: "update" }),
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
              this.getGroups();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        });
    },
    getGroups() {
      const query = {
        $limit: this.listQuery.$limit,
        $skip: this.listQuery.$skip,
        $or: []
      };
      if (this.listQuery.name && this.listQuery.name.length > 0) {
        query.$or.push({ groupName: { $search: this.listQuery.name }});
        query.$or.push({ phone: { $search: this.listQuery.name }});
      } else {
        delete query.$or;
      }
      // if (this.listQuery.phone && this.listQuery.phone.length > 0) {
      //   query.$or.push({ phone: { $search: this.listQuery.phone } });
      // }
      if (this.listQuery.pId && this.listQuery.pId.length > 0) {
        // if (this.listQuery.pId === "1234567890") {
        //   this.listQuery.pId = null;
        // }
        query.pId = this.listQuery.pId;
      }
      console.log(query);
      this.listQuery.name = "";
      this.listQuery.pId = "";
      this.findGroups({
        query: query
      })
        .then(gs => {
          console.log("groups=", gs);
          this.groups = gs.data;
          this.upgroups = [];
          this.upgroups.push({ _id: null, name: "顶级" });
          this.groups.forEach(item => {
            const g = { _id: item._id, name: item.groupName };
            this.upgroups.push(g);
          });
          this.groups.forEach(item => {
            this.upgroups.some(ite => {
              if (ite._id === item.pId) {
                item.upName = ite.name;
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
    // getAllGroups() {
    //   this.allupgroups = [];
    //   this.allupgroups.push({ _id: "1234567890", name: "顶级" });
    //   this.findGroups()
    //     .then(gs => {
    //       const groups = gs.data;

    //       groups.forEach(item => {
    //         const g = { _id: item._id, name: item.groupName };
    //         this.allupgroups.push(g);
    //       });
    //       this.getGroups();
    //     })
    //     .catch(err => {
    //       this.$message.error(err.message);
    //     });
    // },
    handleFilter() {
      this.listQuery.$skip = 0;
      console.log(this.listQuery);

      this.getGroups();
    },
    handleSizeChange(val) {
      this.listQuery.$limit = val;
      this.getGroups();
    },
    handleCurrentChange(val) {
      this.listQuery.$skip = (val - 1) * this.listQuery.$limit;
      console.log(this.listQuery);

      this.getGroups();
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
      if (!this.user.user.roles.includes("admin")) {
        this.$message({
          message: "新增门店请联系管理员,13580512595",
          type: "success",
          duration: 0,
          showClose: true
        });
        return;
      }
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // createData() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
    //       this.temp.author = "vue-element-admin";
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp);
    //         this.dialogFormVisible = false;
    //         this.$notify({
    //           title: "成功",
    //           message: "创建成功",
    //           type: "success",
    //           duration: 2000
    //         });
    //       });
    //     }
    //   });
    // },
    async createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // async createBoard (board) {
          const { Group } = this.$FeathersVuex;
          // delete this.grouptemp.pId;
          console.log(this.grouptemp);

          const newGroup = new Group(this.grouptemp);
          newGroup
            .save()
            .then(result => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建门店成功",
                type: "success",
                duration: 2000
              });
              this.getGroups();
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
          // this.list.unshift(this.grouptemp);
        }
      });
    },
    handleUpdate(row) {
      this.grouptemp = Object.assign({}, row); // copy obj
      this.grouptemp.validDate = new Date(this.grouptemp.validDate);
      this.upgroups = [];
      this.upgroups.push({ _id: null, name: "顶级" });
      this.groups.forEach(item => {
        const g = { _id: item._id, name: item.groupName };
        if (item._id !== this.grouptemp._id) {
          this.upgroups.push(g);
        }
      });
      console.log(this.upgroups);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.grouptemp);
          tempData.validDate = +new Date(tempData.validDate); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          const { Group } = this.$FeathersVuex;
          const newGroup = new Group(tempData);
          newGroup.update(tempData._id, tempData).then(g => {
            // console.log(g);
            this.$notify({
              title: "成功",
              message: "门店更新成功",
              type: "success",
              duration: 2000
            });
            this.dialogFormVisible = false;
            this.upgroups = [];
            this.getGroups();
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除该门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          service
            .service("groups")
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
// .eldialog {
//   margin-top: 5vh;
// }
.filter-container {
  text-align: center;
}
</style>
