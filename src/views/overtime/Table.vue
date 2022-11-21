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
                            <th>Tanggal Pengajuan</th>
                            <th>Tanggal Mulai</th>
                            <th>Jam Mulai</th>
                            <th>Tanggal Selesai</th>
                            <th>Jam Selesai</th>
                            <th class="text-end">Menit Lembur</th>
                            <th class="text-center">Status</th>
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
                            </td>
                            <td>
                                {{ convertDate(val.created_at) }}
                            </td>
                            <td v-if="val.t_absensi_startDate != null">
                                {{ convertDate(val.t_absensi_startDate) }}
                            </td>
                            <td v-else class="text-center">-</td>
                            <td class="text-nowrap" v-if="val.t_absensi_startClock != null">
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
                            <td class="text-end">
                                {{ menitLembur(val) }}
                            </td>
                            <td class="text-center">
                                <div v-html="mapStatus(val.t_absensi_status_admin)"></div>
                            </td>
                            <td class="text-start">
                                <div class="btn-group">
                                    <button v-if="val.t_absensi_latLong != null" type="button"
                                        class="btn btn-sm btn-light" data-bs-toggle="modal" data-toggle="tooltip"
                                        data-placement="right" title="Lokasi awal" data-bs-target="#ModalMaps"
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
                                        class="btn btn-sm btn-light" data-bs-toggle="modal" data-bs-target="#ModalImage"
                                        @click="Modal(val)">
                                        <i class="material-icons">image</i>
                                    </button>
                                    <button v-if="val.t_absensi_catatan != null" type="button"
                                        class="btn btn-sm btn-light" data-bs-toggle="modal"
                                        data-bs-target="#ModalCatatan" @click="Modal(val, 'end')">
                                        <i class="material-icons">book</i>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" data-bs-toggle="modal"
                                        data-toggle="tooltip" data-placement="right" title="Edit"
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
                                    <div v-if="val.t_absensi_status_admin == 0" style="display: contents">
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Setuju" data-bs-toggle="modal"
                                            data-bs-target="#ModalApproval" @click="ModalApprove(val, 'setuju')">
                                            <i class="material-icons">check</i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Tolak" data-bs-toggle="modal"
                                            data-bs-target="#ModalApproval" @click="ModalApprove(val, 'tolak')">
                                            <i class="material-icons">close</i>
                                        </button>
                                    </div>
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
                            <h5 class="modal-title">{{ modal.title }}</h5>
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
                                <label>Tanggal Mulai</label>
                                <input type="date" class="form-control" v-model="modal.startDate" step="any" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Jam Mulai</label>
                                <input type="time" name="time" class="form-control" v-model="modal.startClock"
                                    step="any" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Tanggal Selesai</label>
                                <input type="date" class="form-control" v-model="modal.endDate" step="any"
                                    :disabled="modal.endDate === null" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Jam Selesai</label>
                                <input type="time" name="time" class="form-control" v-model="modal.endClock" step="any"
                                    :disabled="modal.endClock === null" required />
                            </div>
                            <div class="form-group mt-2">
                                <label>Catatan Lembur</label>
                                <textarea class="form-control" v-model="modal.catatan" step="any"></textarea>
                            </div>
                            <div class="form-group mt-2">
                                <label>Status</label>
                                <select class="form-control" required v-model="modal.status_admin">
                                    <option value="" disabled>-- Pilih Status --</option>
                                    <option value="0">Menunggu Persetujuan</option>
                                    <option value="1">Disetujui</option>
                                    <option value="2">Ditolak</option>
                                </select>
                            </div>
                            <div class="form-group mt-2">
                                <label>Catatan Approval</label>
                                <textarea class="form-control" v-model="modal.catatan_admin" step="any"></textarea>
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
                        <h5 class="modal-title">
                            Lokasi Personel Absensi {{ modal.title }}
                        </h5>
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
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Catatan Lembur</h5>
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
                                <label class="mb-2">Mulai</label>
                                <img v-bind:src="modal.photo" alt="" style="width: 100%" />
                            </div>
                            <div class="col-sm-6">
                                <label class="mb-2">Selesai</label>
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
        <div class="modal fade" id="ModalApproval" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="text-center">
                            Silahkan input catatan dari admin pada kolom di bawah ini:
                        </p>
                    </div>
                    <div class="mx-5">
                        <div class="form-group my-3">
                            <label>Catatan Lembur</label>
                            <textarea class="form-control" v-model="data_store.catatan_lembur" readonly
                                step="any"></textarea>
                        </div>
                        <textarea class="form-control" v-model="data_store.catatan" cols="30" rows="10"
                            placeholder="Catatan dari admin"></textarea>
                    </div>
                    <div class="modal-footer text-center">
                        <div class="mx-auto">
                            <button type="button" class="btn rounded-pill btn-light me-2 btn-cancel"
                                data-bs-dismiss="modal">
                                Kembali
                            </button>
                            <button type="button" @click="overtimeApprove()"
                                class="btn rounded-pill btn-primary btn-submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as Api from "../../helper/Api.js";
import { GoogleMap, Marker, MarkerCluster } from "vue3-google-map";
import moment from "moment";
export default {
    data() {
        return {
            api_key: env.VITE_API_GMAPS,
            overtimes: {},
            personels: {},
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
                startDate: "",
                startClock: "",
                endDate: "",
                endClock: "",
                personel: "",
                photo: "",
                photo2: "",
                status_admin: "",
                catatan_admin: "",

            },
            data_store: {
                catatan: "",
                type: "",
                id: "",
            },
            center: {
                lat: -6.93,
                lng: 107.6,
            },
            center2: {
                lat: -6.93,
                lng: 107.6,
            },

            markerOptions: { position: { lat: 0, lng: 0 }, label: "O" },
            locations: [{ lat: -31.56391, lng: 147.154312 }],
            currentPlace: null,
            markers: [],
            markers2: [],
            places: [],
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
        this.loadPersonel();
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
                .get(env.VITE_API_URL + "overtime", {
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
        mapStatus(status) {
            switch (status) {
                case 0:
                    return '<span class="text-muted">Menunggu Persetujuan</span>';
                    break;
                case 1:
                    return '<span class="text-success">Disetujui</span>';
                    break;
                case 2:
                    return '<span class="text-danger">Ditolak</span>';
                    break;
                case 3:
                    return '<span class="text-warning">Kadaluarsa</span>';
                    break;
                default:
                    return "-";
                    break;
            }
        },
        overtimeApprove(type = null) {
            if (type != null) {
                this.data_store.id = this.id;
                this.data_store.type = type;
            }
            $(".btn-submit").attr("disabled", true);
            // $('.btn-submit').attr('disabled', true)
            axios
                .post(env.VITE_API_URL + "overtime/approve", this.data_store)
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
                    $(".btn-submit").attr("disabled", false);
                    $(".btn-cancel").trigger("click");
                })
                .catch((e) => {
                    Api.messageError(e);
                    $(".btn-submit").attr("disabled", false);
                });
        },
        menitLembur(val) {
            var start = val.t_absensi_startDate + " " + val.t_absensi_startClock;
            var end = val.t_absensi_endDate + " " + val.t_absensi_endClock;
            if (val.t_absensi_endDate == null) {
                end = moment().format('YYYY-MM-DD HH:mm:ss')
            }
            console.log(end)
            var a = moment(moment(start).toArray());
            var b = moment(moment(end).toArray());
            var result = b.diff(a, "minutes");
            return (result < 0 ? 0 : result);
        },
        loadPersonel() {
            this.$Progress.start();
            axios
                .get(env.VITE_API_URL + "index-data-personel?show=1000")
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
        Modal(val, type = "start") {
            this.modal = {
                title: "Perbarui Lembur",
                id: val.id_t_absensi,
                personel: val.personel.id_m_personel,
                nama: val.personel.m_personel_names,
                startClock: val.t_absensi_startClock,
                endClock: val.t_absensi_endClock,
                startDate: val.t_absensi_startDate,
                endDate: val.t_absensi_endDate,
                catatan: val.t_absensi_catatan,
                status_admin: val.t_absensi_status_admin,
                catatan_admin: val.t_absensi_catatan_admin,
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
        ModalApprove(val, type = "start") {
            this.data_store = {
                id: val.id_t_absensi,
                type: type,
                catatan_lembur: val.t_absensi_catatan
            };
        },
        ModalReset() {
            this.modal = {
                title: "Tambah Lembur",
                id: "",
                nama: "",
                startDate: "",
                startClock: "",
                endDate: "",
                endClock: "",
                personel: "",
            };
        },
        Maps(val, status) {
            this.locations = [];
            var latLong = val.t_absensi_latLong.split(",");
            this.modal.title = "Mulai";
            if (status == "end") {
                this.modal.title = "Selesai";
                latLong = val.t_absensi_latLongEnd.split(",");
            }
            this.center = {
                lat: parseFloat(latLong[0]),
                lng: parseFloat(latLong[1]),
            };
            this.locations.push(this.center);
            console.log(this.locations)
        },
        updateAbsensi() {
            $("#submit").prop("disabled", true);
            $("#submit").html("Loading...");
            axios
                .post(env.VITE_API_URL + "overtime", {
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
        },
        confirmDelete(id, name) {
            return Api.confirmDelete(
                "Apakah anda yakin?",
                "Absensi " + name + " akan dihapus!"
            ).then((result) => {
                if (result.isConfirmed) {
                    this.deleteAbsensiLembur(id);
                }
            });
        },
        deleteAbsensiLembur(id) {
            axios
                .delete(env.VITE_API_URL + "overtime/" + id)
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
    }
}
</script>