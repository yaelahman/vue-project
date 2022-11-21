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
                            <th>No</th>
                            <th style="text-align: start">Nama</th>
                            <th>Tanggal Masuk</th>
                            <th>Jam Masuk</th>
                            <th>Tanggal Pulang</th>
                            <th>Jam Pulang</th>
                            <th class="text-start">Jadwal Kerja</th>
                            <th class="text-end">Menit Terlambat</th>
                            <th class="text-end">Denda</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-if="!isLoading">
                        <tr v-for="(val, index) in data.data" :key="index" class="odd">
                            <td class="text-center">{{ (current_page == 1 ? 0 : ((current_page - 1) * 10)) +
                                    (index
                                        + 1)
                            }}</td>
                            <td style="width: 10px; text-align: start">
                                {{ val.personel.m_personel_names }}
                                <span style="margin-left: 5px" v-if="val.t_absensi_status == 2" class="
                                badge
                                badge-sm
                                badge-style-bordered
                                badge-warning
                              ">WFH</span>
                            </td>
                            <td v-if="val.t_absensi_startDate != null">
                                {{ convertDate(val.t_absensi_startDate) }}
                            </td>
                            <td v-else class="text-center">-</td>
                            <td class="text-nowrap" v-bind:class="{
                                'text-danger': val.t_absensi_isLate != 1,
                            }" v-if="val.t_absensi_startClock != null">
                                {{ val.t_absensi_startClock }} WIB
                            </td>
                            <td v-else class="text-center">-</td>
                            <td v-if="val.t_absensi_endDate != null">
                                {{ convertDate(val.t_absensi_endDate) }}
                            </td>
                            <td v-else class="text-center">-</td>
                            <td class="text-nowrap" v-if="val.t_absensi_endClock != null">
                                {{ val.t_absensi_endClock }} WIB
                            </td>
                            <td v-else class="text-center">-</td>
                            <td class="text-start">
                                {{ val.work_personel.get_work_pattern.m_work_patern_name }}
                            </td>
                            <td class="text-end">
                                {{ val.t_absensi_isLate == 1 ? '0' : menitTerlambat(val) }}
                            </td>
                            <td class="text-end">
                                {{ val.t_absensi_isLate == 1 ? '0' : hitungDenda(val) }}
                            </td>
                            <td class="text-start">
                                <div class="btn-group">
                                    <button v-if="val.t_absensi_latLong != null" type="button"
                                        class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right"
                                        title="Lokasi awal" data-bs-toggle="modal" data-bs-target="#ModalMaps"
                                        @click="Maps(val, 'start')">
                                        <i class="material-icons">place</i>
                                    </button>
                                    <button v-if="val.t_absensi_latLongEnd != null" type="button"
                                        class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right"
                                        title="Lokasi akhir" data-bs-toggle="modal" data-bs-target="#ModalMaps"
                                        @click="Maps(val, 'end')">
                                        <i class="material-icons">place</i>
                                    </button>
                                    <button v-if="val.photo_absensi.length > 0" type="button"
                                        class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right"
                                        title="Image" data-bs-toggle="modal" data-bs-target="#ModalImage"
                                        @click="Modal(val)">
                                        <i class="material-icons">image</i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Catatan Telat Masuk & Pulang"
                                        data-bs-toggle="modal" data-bs-target="#ModalCatatan"
                                        @click="Modal(val, 'end')">
                                        <i class="material-icons">book</i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Edit" data-bs-toggle="modal"
                                        data-bs-target="#Modal" @click="Modal(val)">
                                        <i class="material-icons">edit</i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Hapus" @click="
                                            confirmDelete(
                                                val.id_t_absensi,
                                                val.personel.m_personel_names
                                            )
                                        ">
                                        <i class="material-icons">delete</i>
                                    </button>
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

        <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="updateAbsensi()">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ modal.title }} Kehadiran Harian</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                        <input type="hidden" v-model="modal.startDate" />
                        <input type="hidden" v-model="modal.endDate" />
                        <div class="modal-body">
                            <div class="form-group mt-2">
                                <label>Nama</label>
                                <select class="form-control" required v-model="modal.personel">
                                    <option value="" disabled>-- Pilih Personel --</option>
                                    <option v-for="(row, index) in personels" :key="index" :value="row.id_m_personel">
                                        {{ row.m_personel_names }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group mt-2">
                                <label>Keterangan Datang</label>
                                <select v-model="modal.isLate" class="form-control">
                                    <option value="" disabled>-- Pilih Status --</option>
                                    <option value="1">Tidak Terlambat</option>
                                    <option value="2">Terlambat</option>
                                </select>
                            </div>

                            <div class="form-group mt-2">
                                <label>Tanggal Masuk</label>
                                <input type="date" class="form-control" v-model="modal.startDate" step="any" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Jam Masuk</label>
                                <input type="time" class="form-control" v-model="modal.startClock" step="any"
                                    required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Tanggal Pulang</label>
                                <input type="date" class="form-control" v-model="modal.endDate" step="any"
                                    :disabled="modal.endDate === null" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Jam Pulang</label>
                                <input type="time" class="form-control" v-model="modal.endClock" step="any"
                                    :disabled="modal.endClock === null" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Catatan Terlambat Masuk <small class="text-danger">*Isi jika ada</small></label>
                                <textarea class="form-control" v-model="modal.catatan_masuk"></textarea>

                            </div>
                            <div class="form-group mt-2">
                                <label>Catatan Terlambat Pulang <small class="text-danger">*Isi jika ada</small></label>
                                <textarea class="form-control" v-model="modal.catatan_pulang"></textarea>

                            </div>
                            <div class="form-group mt-2">
                                <label>Lokasi Kehadiran <small class="text-danger">*Opsional</small></label>
                                <select v-model="modal.attendance_spot" class="form-control">
                                    <option value="" disabled>-- Pilih Lokasi Kehadiran --</option>
                                    <option v-for="(val, index) in attendance_spot" :key="index"
                                        :value="val.id_m_attendance_spots">
                                        {{ val.m_attendance_spots_name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group mt-2 ml-5">
                                <div class="form-check form-switch">
                                    <input class="form-check-input ml-3" type="checkbox" v-model="modal.status" />
                                    <label class="form-check-label" for="flexSwitchCheckChecked">WFH ?</label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" id="submit" class="btn btn-primary">
                                Simpan
                            </button>
                            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                                Tutup
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ModalMaps" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Lokasi Personel Absensi</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <GoogleMap :api-key="api_key" style="width: 100%; height: 500px" :center="center"
                                    :zoom="15">
                                    <!-- <Marker :options="markerOptions" /> -->

                                    <MarkerCluster>
                                        <Marker v-for="(location, i) in locations" :options="{ position: location }"
                                            :key="i" />
                                    </MarkerCluster>
                                </GoogleMap>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ModalCatatan" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Catatan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Catatan Terlambat Masuk</h5>
                                <textarea class="form-control mb-4" v-model="modal.catatan_masuk" cols="30" rows="10"
                                    readonly></textarea>
                            </div>
                            <div class="col-sm-6">
                                <h5>Catatan Terlambat Pulang</h5>
                                <textarea class="form-control" v-model="modal.catatan_pulang" cols="30" rows="10"
                                    readonly></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ModalImage" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Foto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <label class="mb-2">Masuk</label>
                                <img v-bind:src="modal.photo" alt="" style="width: 100%" />
                            </div>
                            <div class="col-sm-6">
                                <label class="mb-2">Pulang</label>
                                <img v-bind:src="modal.photo2" alt="" style="width: 100%" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ModalCatatan" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Catatan Absensi</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                    </div>
                    <div class="modal-body">
                        <textarea class="form-control" v-model="modal.catatan" cols="30" rows="10" readonly></textarea>
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
import moment from "moment";
import { GoogleMap, Marker, MarkerCluster } from "vue3-google-map";
export default {
    data() {
        return {
            api_key: env.VITE_API_GMAPS,
            data: {
                data: [],
                last_page: 1
            },
            show: 10,
            search: "",
            query: this.$route.query,
            current_page: 1,
            isLoading: false,
            paginate: [1],

            modal: {
                id: "",
                nama: "",
                isLate: "",
                startDate: "",
                startClock: "",
                endDate: "",
                endClock: "",
                status: false,
                photo: "",
                photo2: "",
                catatan_masuk: "",
                catatan_pulang: "",
                attendance_spot: ""
            },
            center: { lat: 0, lng: 0 },
            markerOptions: { position: { lat: 0, lng: 0 }, label: "O" },
            locations: [{ lat: -31.56391, lng: 147.154312 }],
            markers: [],
            markers2: [],
            filterType: null,
            attendance_spot: [],
        }
    },
    components: { GoogleMap, Marker },
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
        this.loadPersonel()
        this.getAttendanceSpot()
    },
    methods: {
        loadPersonel() {
            this.$Progress.start();
            axios
                .get(env.VITE_API_URL + "index-data-personel?show=1000", {
                    params: {
                        work_personel: true
                    }
                })
                .then((response) => {
                    if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                        this.$Progress.finish();
                        this.personels = response.data.data.data;
                    }
                })
                .catch((e) => {
                    this.$Progress.fail();
                    Api.messageError(e);
                });
        },
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
                .get(env.VITE_API_URL + "daily-attendance", {
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

        getMapData(place) {
            this.place = place;
        },
        getAttendanceSpot() {
            this.$Progress.start();
            axios
                .get(env.VITE_API_URL + "attendance-spot")
                .then((response) => {
                    this.$Progress.finish();
                    this.attendance_spot = response.data.data;
                })
                .catch((error) => {
                    this.$Progress.fail();
                });
        },
        hitungDenda(val) {
            let denda = localStorage.getItem("denda") != undefined ? localStorage.getItem("denda") : 0
            let menit = this.menitTerlambat(val)
            console.log(denda, menit)
            return this.formatRupiah((denda * menit).toString())
        },
        formatRupiah(angka, prefix) {
            var number_string = angka.replace(/[^,\d]/g, '').toString(),
                split = number_string.split(','),
                sisa = split[0].length % 3,
                rupiah = split[0].substr(0, sisa),
                ribuan = split[0].substr(sisa).match(/\d{3}/gi);

            // tambahkan titik jika yang di input sudah menjadi angka ribuan
            if (ribuan) {
                var separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
            return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
        },
        menitTerlambat(val) {
            var start = val.t_absensi_startDate + " " + val.t_absensi_startClock;
            var now =
                val.t_absensi_Dates +
                " " +
                (val.work_personel !== null
                    ? val.work_personel.get_work_schedule.m_work_schedule_clockIn
                    : 0);
            // val.work_personel.get_work_schedule.m_work_schedule_clockIn
            var tolerance =
                val.work_personel !== null
                    ? val.work_personel.get_work_pattern.m_work_patern_tolerance
                    : 0;
            var a = moment(moment(start).toArray());
            var b = moment(moment(now).toArray());
            var result =
                a.diff(b, "minutes") - tolerance < 0
                    ? 0
                    : a.diff(b, "minutes") - tolerance;
            return result;
        },

        confirmDelete(id, name) {
            return Api.confirmDelete(
                "Apakah anda yakin?",
                "Absensi " + name + " akan dihapus!"
            ).then((result) => {
                if (result.isConfirmed) {
                    this.deleteDailyAttendance(id);
                }
            });
        },
        deleteDailyAttendance(id) {
            axios
                .delete(env.VITE_API_URL + "daily-attendance/" + id)
                .then((response) => {
                    this.fetchData();
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
        Modal(val, type = "start") {
            this.modal = {
                title: "Perbarui",
                id: val.id_t_absensi,
                nama: val.personel.m_personel_names,
                personel: val.personel.id_m_personel,
                isLate: val.t_absensi_isLate,
                startClock: val.t_absensi_startClock,
                endClock: val.t_absensi_endClock,
                startDate: val.t_absensi_startDate,
                endDate: val.t_absensi_endDate,
                catatan: val.t_absensi_catatan,
                catatan_masuk:
                    val.t_absensi_catatan_telat_masuk == null
                        ? "-"
                        : val.t_absensi_catatan_telat_masuk,
                catatan_pulang:
                    val.t_absensi_catatan == null ? "-" : val.t_absensi_catatan,
                photo: null,
                photo2: null,
            };
            if (val.t_absensi_status == 2) {
                this.modal.status = true;
            }
            if (val.photo_absensi.length > 0) {
                if (val.photo_absensi.length > 1) {
                    this.modal.photo2 =
                        Api.URL_PHOTO + val.photo_absensi[1].t_absensi_photofileOri;
                }
                this.modal.photo =
                    Api.URL_PHOTO + val.photo_absensi[0].t_absensi_photofileOri;
            }
        },
        ModalReset() {
            this.modal = {
                title: "Tambah",
                id: "",
                nama: "",
                isLate: '',
                startDate: "",
                startClock: "",
                endDate: "",
                endClock: "",
                personel: "",
                catatan: "",
                catatan_masuk: "",
                catatan_pulang: "",
            };
        },
        Maps(val, status) {
            this.locations = [];
            var latLong = val.t_absensi_latLong.split(",");
            if (status == "end") {
                latLong = val.t_absensi_latLongEnd.split(",");
            }
            this.center = {
                lat: parseFloat(latLong[0]),
                lng: parseFloat(latLong[1]),
            };
            this.locations.push(this.center);
        },
        updateAbsensi() {
            $("#submit").prop("disabled", true);
            $("#submit").html("Loading...");
            axios
                .post(env.VITE_API_URL + "daily-attendance", {
                    id: this.modal.id,
                    absensi: this.modal,
                })
                .then((response) => {
                    if (Api.response(response.data) === Api.STATUS_SUCCESS) {
                        $("#Modal").modal("hide");
                        this.fetchData();
                    }
                    $("#submit").prop("disabled", false);
                    $("#submit").html("Submit");
                })
                .catch((e) => {
                    Api.messageError(e);
                    $("#submit").prop("disabled", false);
                });
        }
    }
}
</script>