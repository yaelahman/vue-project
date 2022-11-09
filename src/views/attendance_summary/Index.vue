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
                    <table id="dt-attendancesummary" class="display" style="width: 100%">
                      <thead class="text-center" style="vertical-align: top;">
                        <tr>
                          <th class="text-start">Nama</th>
                          <th class="text-start">Departemen</th>
                          <th>Kehadiran Hari</th>
                          <th>Kehadiran Jam</th>
                          <th>Terlambat</th>
                          <th>Tidak Terlambat</th>
                          <th>WFH</th>
                          <th>Tidak Absen</th>
                          <th>Cuti</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(val, index) in attendance_summary" :key="index">
                          <td>{{ val.m_personel_names }}</td>
                          <td>{{ val.departemen.m_departemen_name }}</td>
                          <td class="text-center">{{ val.kehadiran ?? 0 }}</td>
                          <td class="text-center">{{ val.total_jam ?? 0 }}</td>
                          <td class="text-center">
                            <div class="detail-as" @click="Detail(val, 'Terlambat')">
                              {{ val.terlambat ?? 0 }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="detail-as" @click="Detail(val, 'Tidak Terlambat')">
                              {{ val.tidak_terlambat ?? 0 }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="detail-as" @click="Detail(val, 'WFH')">
                              {{ val.wfh ?? 0 }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="detail-as" @click="Detail(val, 'Tidak Absen')">
                              {{ val.tidak_hadir ?? 0 }}
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="detail-as" @click="Detail(val, 'Cuti')">
                              {{ val.total_cuti ?? 0 }}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalDetailTerlambat" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modal.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
          </div>
          <div class="modal-body table-responsive">
            <div v-if="isLoading" v-html="loader"></div>
            <table v-else id="tableTerlambat" class="display text-center" style="width: 100%;">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Keterangan Terlambat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in detail_attendance_summary" :key="index">
                  <td>{{ parseInt(index) + 1 }}</td>
                  <td>{{ convertDate(val.t_absensi_Dates ?? val) }}</td>
                  <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{ convertDate(val.t_absensi_startClock,
                      'HH:mm:ss')
                  }}</td>
                  <td class="text-start">{{ val.t_absensi_catatan_telat_masuk }}</td>
                  <td>{{ val.t_absensi_status == 1 ? 'WFO' : 'WFH' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalDetailTidakTerlambat" tabindex="-1" aria-labelledby="ModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modal.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
          </div>
          <div class="modal-body table-responsive">
            <div v-if="isLoading" v-html="loader"></div>
            <table v-else id="tableTidakTerlambat" class="display text-center" style="width: 100%">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in detail_attendance_summary" :key="index">
                  <td>{{ parseInt(index) + 1 }}</td>
                  <td>{{ convertDate(val.t_absensi_Dates ?? val) }}</td>
                  <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{ convertDate(val.t_absensi_startClock,
                      'HH:mm:ss')
                  }}</td>
                  <td>{{ val.t_absensi_status == 1 ? 'WFO' : 'WFH' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalDetailWFH" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modal.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
          </div>
          <div class="modal-body table-responsive">
            <div v-if="isLoading" v-html="loader"></div>
            <table v-else id="tableWFH" class="display text-center" style="width: 100%">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Jam Masuk</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in detail_attendance_summary" :key="index">
                  <td>{{ parseInt(index) + 1 }}</td>
                  <td>{{ convertDate(val.t_absensi_Dates ?? val) }}</td>
                  <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{ convertDate(val.t_absensi_startClock,
                      'HH:mm:ss')
                  }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalDetailTidakAbsen" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modal.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
          </div>
          <div class="modal-body table-responsive">
            <div v-if="isLoading" v-html="loader"></div>
            <table v-else id="tableTidakAbsen" class="display text-center" style="width: 100%">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in detail_attendance_summary" :key="index">
                  <td>{{ parseInt(index) + 1 }}</td>
                  <td>{{ convertDate(val.t_absensi_Dates ?? val) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="ModalDetailCuti" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modal.title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
          </div>
          <div class="modal-body table-responsive">
            <div v-if="isLoading" v-html="loader"></div>
            <table v-else id="tableCuti" class="display text-center" style="width: 100%">
              <thead class="text-center">
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(val, index) in detail_attendance_summary" :key="index">
                  <td>{{ parseInt(index) + 1 }}</td>
                  <td>{{ convertDate(val.permit_date ?? val) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Tutup
            </button>
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
      isLoading: false,
      loader: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  style="margin:auto;background:transparent;display:block;" width="100px" height="100px"
                  viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                  <circle cx="50" cy="50" r="30" stroke="#34b1e8" stroke-width="10" fill="none"></circle>
                  <circle cx="50" cy="50" r="30" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none">
                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
                      values="0 50 50;180 50 50;720 50 50" keyTimes="0;0.5;1"></animateTransform>
                    <animate attributeName="stroke-dasharray" repeatCount="indefinite" dur="1s"
                      values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
                      keyTimes="0;0.5;1"></animate>
                  </circle>
                </svg>`,
      modal: {
        id_m_personel: "",
        title: "",
        nama: "",
        data: []
      },
      table: null,
      filterType: "",
      departemens: []
    };
  },
  created() {
    this.loadAttendanceSummary();
    this.loadDepartemen();
  },
  mounted() {
    setTimeout(() => {
      this.table = $("#dt-attendancesummary").DataTable();
    }, 1000);
  },
  methods: {
    async Detail(val, type) {
      this.isLoading = true;
      this.modal = {
        title: "Data " + this.capitalizeFirstLetter(type) + ' ' + val.m_personel_names,
        id_m_personel: val.id_m_personel,
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        data: null,
        type: type,
      }

      $('#ModalDetail' + this.modal.type.replace(' ', '')).modal('show')
      this.detail_attendance_summary = []
      if (this.table2 != null) {
        this.table2.destroy();
      }
      // this.table2 = $("#table" + this.modal.type.replace(' ', '')).DataTable();
      this.$Progress.start();
      await axios
        .get(env.VITE_API_URL + "detail-attendance-summary", { params: this.modal })
        .then((response) => {
          this.isLoading = !this.isLoading;
          this.$Progress.finish();
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            // setTimeout(() => {
            this.detail_attendance_summary = response.data.data;
            // this.table2.destroy();
            this.$nextTick(() => {
              this.table2 = $("#table" + this.modal.type.replace(' ', '')).DataTable();
            });
            // }, 1000)
          }
        })
        .catch((e) => {
          this.isLoading = !this.isLoading;
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    loadDepartemen() {
      this.isLoading = !this.isLoading;
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "index-departemen")
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.isLoading = !this.isLoading;
            this.$Progress.finish();
            this.departemens = response.data.data;
          }
        })
        .catch((e) => {
          this.isLoading = !this.isLoading;
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    filterRangeDate() {
      if (this.filterType == "show") {
        var a = moment(moment(this.search.startDate).toArray());
        var b = moment(moment(this.search.endDate).toArray());
        // if (b.diff(a, "days") + 1 < 8) {
        this.loadAttendanceSummary();
        // } else {
        //   Swal.fire({
        //     title: "Perhatian",
        //     text: "Selisih tanggal melebihi dari 7 hari harap gunakan unduh",
        //     icon: "warning",
        //     confirmButtonColor: "#3085d6",
        //     confirmButtonText: "OK",
        //   });
        // }
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
    loadAttendanceSummary() {
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "attendance-summary", { params: this.search })
        .then((response) => {
          this.$Progress.finish();
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.attendance_summary = response.data.data;
            this.table.destroy();
            this.$nextTick(() => {
              this.table = $("#dt-attendancesummary").DataTable();
            });
          }
        })
        .catch((e) => {
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    resetEndDate() {
      this.search.endDate = "";
    },
  },
  convertDate(date, format = "DD-MM-YYYY", empty = "-", subtract = false) {
    console.log(date)
    return Api.convertDate(date, format, empty, subtract);
  },
};
</script>