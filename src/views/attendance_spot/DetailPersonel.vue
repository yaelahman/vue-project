<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Detail Penempatan</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">

                  <router-link :to="{
                    name: 'addPersonelAttendanceSpot',
                    params: { id: id },
                  }" class="btn btn-primary">
                    <i class="material-icons">add</i>Tambah
                  </router-link>
                </div>
                <div class="card-body">
                  <table id="dt-detailpersonel" class="display" style="width: 100%">
                    <thead class="text-start">
                      <tr>
                        <th style="width: 20%">PersonelID</th>
                        <th>Nama Personel</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(val, index) in attendance_personels" :key="index">
                        <td>{{ val.get_personel.m_personel_personID }}</td>
                        <td>{{ val.get_personel.m_personel_names }}</td>
                        <td class="text-start">
                          <button type="button" class="btn btn-sm btn-light" @click="
                            confirmDelete(
                              val.id_m_attendance_personel,
                              val.get_personel.m_personel_names
                            )
                          ">
                            <i class="material-icons">delete</i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="mt-5">
                    <router-link :to="{
                      path: '/attendance-spot',
                      query: $route.query
                    }" class="btn btn-light">
                      <i class="material-icons">arrow_back</i>Kembali
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Api from "../../helper/Api.js";
export default {
  data() {
    return {
      id: "",
      table: null,
      attendance_personels: {},
    };
  },
  created() {
    this.loadAttendancePersonel();
  },
  mounted() {
    this.id = this.$route.params.id;
    this.id = this.id != null ? this.id : "";
    setTimeout(() => {
      this.table = $("#dt-detailpersonel").DataTable();
    }, 1000);
  },
  methods: {
    loadAttendancePersonel() {
      this.id = this.$route.params.id;
      this.id = this.id != null ? this.id : "";
      if (this.id != "") {
        this.$Progress.start();
        axios
          .get(env.VITE_API_URL + "index-attendance-personel/" + this.id)
          .then((response) => {
            if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
              this.$Progress.finish();
              this.attendance_personels = response.data.data;
              this.table.destroy();
              this.$nextTick(() => {
                this.table = $("#dt-detailpersonel").DataTable();
              });
            }
          })
          .catch((e) => {
            this.$Progress.fail();
            Api.messageError(e);
          });
      }
    },
    confirmDelete(id, nama) {
      return Api.confirmDelete(
        "Apakah anda yakin?",
        "Personel " + nama + " di Attendance Personel akan dihapus!"
      ).then((result) => {
        if (result.isConfirmed) {
          this.deleteAttendancePersonel(id);
        }
      });
    },
    deleteAttendancePersonel(id) {
      axios
        .delete(env.VITE_API_URL + "delete-attendance-personel/" + id)
        .then((response) => {
          this.loadAttendancePersonel();
          let status = response.data.status;
          let message = response.data.message;
          let status_message =
            status == Api.STATUS_SUCCESS ? Api.MES_SUCESS : Api.MES_ERROR;
          Toast.fire({
            icon: status_message,
            title: message,
          });
        })
        .catch((e) => {
          Api.messageError(e);
        });
    },
  },
};
</script>