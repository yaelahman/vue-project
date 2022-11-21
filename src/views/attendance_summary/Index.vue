<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Ringkasan Absensi</h1>

              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <form @submit.prevent="filterRangeDate()">
                    <div class="row">
                      <div class="col-lg-3 col-md-4 col-sm-4 col-6">
                        <label>Tanggal Mulai</label>
                        <input type="date" class="form-control start-date" placeholder="Tanggal Mulai"
                          v-model="search.startDate" @click="search.endDate = ''" required />
                      </div>
                      <div class="col-lg-3 col-md-4 col-sm-4 col-6">
                        <label>Tanggal Selesai</label>
                        <input type="date" class="form-control" placeholder="Tanggal Selesai" :min="search.startDate"
                          v-model="search.endDate" :disabled="search.startDate == ''" required />
                      </div>
                      <div class="col-lg-3 col-md-4 col-sm-4 col-12">
                        <label>Departemen</label>
                        <select v-model="search.departemen" class="form-control">
                          <option value="">Semua</option>
                          <option v-for="(val, index) in departemens" :key="index" :value="val.id_m_departemen">
                            {{ val.m_departemen_name }}
                          </option>
                        </select>
                      </div>
                      <div class="col-lg-3 col-md-4 col-sm-4 col-12 d-flex" style="margin-top: 1.8rem">
                        <button class="btn btn-sm text-nowrap btn-primary mb-2 me-2" @click="filterType = 'show'">
                          Tampilkan
                        </button>
                        <button class="btn btn-sm text-nowrap btn-primary mb-2 me-2" @click="filterType = 'download'">
                          Unduh
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3.75 19.5H20.25C20.4489 19.5 20.6397 19.579 20.7803 19.7197C20.921 19.8603 21 20.0511 21 20.25C21 20.4489 20.921 20.6397 20.7803 20.7803C20.6397 20.921 20.4489 21 20.25 21H3.75C3.55109 21 3.36032 20.921 3.21967 20.7803C3.07902 20.6397 3 20.4489 3 20.25C3 20.0511 3.07902 19.8603 3.21967 19.7197C3.36032 19.579 3.55109 19.5 3.75 19.5ZM12.75 13.554L18.288 8.0145L19.3485 9.075L11.925 16.5L4.5 9.075L5.5605 8.0145L11.25 13.704V3H12.75V13.554Z"
                              fill="white" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <Table v-if="renderComponent" />
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
<style>
.detail-as {
  cursor: pointer;
  text-decoration: underline;
}

.detail-as:hover {
  color: #34B1E8 !important;
}
</style>
<script>
import * as Api from "../../helper/Api.js";
import Swal from "sweetalert2";
import moment from "moment";
import Table from "./Table.vue";

export default {
  data() {
    return {
      attendance_summary: {},
      detail_attendance_summary: [],
      search: {
        startDate: "",
        endDate: "",
        departemen: ""
      },

      table: null,
      filterType: "",
      departemens: [],
      renderComponent: true,
    };
  },
  components: { Table },
  created() {
    this.loadDepartemen();

    this.search = {
      t_absensi_Dates: this.$route.query.t_absensi_Dates ?? '',
      startDate: this.$route.query.startDate ?? '',
      endDate: this.$route.query.endDate ?? '',
      departemen: this.$route.query.departemen ?? '',
    }
  },
  methods: {
    loadDepartemen() {
      this.isLoading = !this.isLoading;
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "index-departemen?show=1000")
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.isLoading = !this.isLoading;
            this.$Progress.finish();
            this.departemens = response.data.data.data;
          }
        })
        .catch((e) => {
          this.isLoading = !this.isLoading;
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    filterRangeDate() {
      if (this.filterType == "show") {
        this.$router.push({
          path: '/attendance-summary',
          query: this.search
        })
        setTimeout(async () => {
          this.renderComponent = false;

          await this.$nextTick();
          this.renderComponent = true;
        }, 100)
      } else {
        Swal.fire({
          title: "Ekspor Ringkasan Absensi",
          text:
            "Ingin Ekspor Ringkasan Absensi Dengan Tanggal " +
            this.search.startDate +
            " Sampai " +
            this.search.endDate +
            " ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          reverseButtons: true,
        }).then((resp) => {
          if (resp.isConfirmed) {
            axios
              .get(
                `${env.VITE_API_URL}/exports/ringkasan_kehadiran?start_date=${this.search.startDate}&end_date=${this.search.endDate}`
              )
              .then((resp) => {
                if (resp.status == 200) {
                  if (Api.response(resp.data) === Api.STATUS_SUCCESS) {
                    window.location.href = resp.data.url;
                  }
                }
              });
          }
        });
      }
    },

  },
};
</script>