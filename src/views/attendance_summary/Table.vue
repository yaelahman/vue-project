<template>
    <div id="dt-1_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="dataTables_length" id="dt-1_length">
                    <label>Tampilkan
                        <select v-model="show" @change="showEntries()" aria-controls="dt-1"
                            class="custom-select custom-select-sm form-control form-control-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select> data
                    </label>
                </div>
            </div>
            <div class="col-sm-12 col-md-6">
                <div id="dt-1_filter" class="dataTables_filter">
                    <label>
                        Pencarian:
                        <input type="search" v-model="search" class="form-control form-control-sm" placeholder=""
                            aria-controls="dt-1">
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <table id="dt-1" class="display w-100 dataTable no-footer" style="width: 100%;"
                    aria-describedby="dt-1_info">
                    <thead class="text-start">
                        <tr>
                            <th style="width: 20px;">
                                No
                            </th>
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
                    <tbody v-if="!isLoading">
                        <tr v-for="(val, index) in data.data" :key="index" class="odd">
                            <td class="text-center">{{ (current_page == 1 ? 0 : ((current_page - 1) * 10)) +
                                    (index
                                        + 1)
                            }}</td>
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
                        <tr v-if="data.data.length < 1">
                            <td class="text-center" colspan="40">
                                Data tidak ditemukan.
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="isLoading">
                        <tr>
                            <td class="text-center bg-light" colspan="40">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    style="margin:auto;background:transparent;display:block;" width="50px" height="50px"
                                    viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                                    <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#1f1f2b"
                                        stroke-dasharray="50.26548245743669 50.26548245743669" fill="none"
                                        stroke-linecap="round">
                                        <animateTransform attributeName="transform" type="rotate"
                                            repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50">
                                        </animateTransform>
                                    </circle>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-5">
                <div class="dataTables_info" id="dt-1_info" role="status" aria-live="polite">Menampilkan
                    <b>{{ data.from ?? 0 }}</b>
                    - <b>{{ data.to ?? 0 }}</b> dari
                    <b>{{ data.total ?? 0 }}</b> data
                </div>
            </div>
            <div class="col-sm-12 col-md-7">

                <div class="dataTables_paginate paging_simple_numbers" id="dt-1_paginate">
                    <ul class="pagination">
                        <li class="paginate_button page-item previous" :class="current_page == 1 ? 'disabled' : ''"
                            id="dt-1_previous">
                            <button @click.prevent="changePage(current_page - 1)" aria-controls="dt-1" data-dt-idx="0"
                                tabindex="0" class="page-link h-100">
                                <i class="material-icons pt-0 pb-0" style="font-size: 18px">chevron_left</i>
                            </button>
                        </li>
                        <li v-for="(page, index) in paginate" :key="index" class="paginate_button page-item"
                            :class="current_page == page ? 'active' : ''">
                            <button @click.prevent="changePage(page)" aria-controls="dt-1" data-dt-idx="1" tabindex="0"
                                class="page-link h-100">
                                <span class="my-auto">{{ page }}</span>
                            </button>
                        </li>
                        <li class="paginate_button page-item next"
                            :class="current_page == (data.last_page ?? 1) ? 'disabled' : ''" id="dt-1_next">
                            <button @click.prevent="changePage(current_page + 1)" aria-controls="dt-1" data-dt-idx="2"
                                tabindex="0" class="page-link h-100">
                                <i class="material-icons pt-0 pb-0" style="font-size: 18px">chevron_right</i>
                            </button>
                        </li>
                    </ul>
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
                        <div v-if="isLoadingDetail" v-html="loader"></div>
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
                                    <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{
                                            convertDate(val.t_absensi_startClock,
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
                        <div v-if="isLoadingDetail" v-html="loader"></div>
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
                                    <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{
                                            convertDate(val.t_absensi_startClock,
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
                        <div v-if="isLoadingDetail" v-html="loader"></div>
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
                                    <td :class="val.t_absensi_isLate == 2 ? 'text-danger' : ''">{{
                                            convertDate(val.t_absensi_startClock,
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
        <div class="modal fade" id="ModalDetailTidakAbsen" tabindex="-1" aria-labelledby="ModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ modal.title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body table-responsive">
                        <div v-if="isLoadingDetail" v-html="loader"></div>
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
                        <div v-if="isLoadingDetail" v-html="loader"></div>
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
    </div>
</template>
<script>
import * as Api from "../../helper/Api.js";
export default {
    data() {
        return {
            data: {
                data: [],
                last_page: 1
            },
            show: 10,
            search: "",
            query: this.$route.query,
            current_page: 1,
            isLoading: false,
            isLoadingDetail: false,
            paginate: [1],
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
        }
    },
    watch: {
        search(newSearch, oldSearch) {
            this.fetchData(newSearch)
        }
    },
    created() {
        if (this.query.page) {
            this.current_page = this.query.page
        }
        this.fetchData()
    },
    methods: {
        changePage(page) {
            if (page != this.current_page) {
                this.current_page = page
                this.fetchData()
            }

        },
        showEntries() {
            this.fetchData()
        },
        searchEntries() {
            this.fetchData()
        },
        allPage() {
            this.paginate = []
            for (var i = -1; i < parseInt(this.data.last_page); i++) {
                if (i < 2) {
                    if ((parseInt(this.current_page) + i) != 0 && (parseInt(this.current_page) + i) <= parseInt(this.data.last_page)) {
                        this.paginate.push((parseInt(this.current_page) + i))
                    }
                }
            }
        },
        fetchData(search = '') {
            this.isLoading = true
            axios
                .get(env.VITE_API_URL + "attendance-summary", {
                    params: {
                        page: this.current_page,
                        show: this.show,
                        search: search,
                        ...this.$route.query
                    }
                })
                .then((response) => {
                    if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                        this.$Progress.finish();
                        this.data = response.data.data;
                        if (this.data.last_page < this.current_page) {
                            this.current_page = 1
                            this.fetchData()
                        }
                        this.allPage()
                    }
                    this.isLoading = false
                })
                .catch((e) => {
                    this.$Progress.fail();
                    Api.messageError(e);
                    this.isLoading = false
                });
        },
        async Detail(val, type) {
            this.isLoadingDetail = true;
            this.modal = {
                title: "Data " + this.capitalizeFirstLetter(type) + ' ' + val.m_personel_names,
                id_m_personel: val.id_m_personel,
                data: null,
                type: type,
                ...this.$route.query
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
                    this.isLoadingDetail = !this.isLoadingDetail;
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
                    this.isLoadingDetail = !this.isLoadingDetail;
                    this.$Progress.fail();
                    Api.messageError(e);
                });
        },
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
    }
}
</script>