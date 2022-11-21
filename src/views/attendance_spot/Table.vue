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
                            <th class="text-nowrap">Nama Lokasi</th>
                            <th class="text-nowrap">Total Anggota</th>
                            <th>Alamat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-if="!isLoading">
                        <tr v-for="(val, index) in data.data" :key="index" class="odd">
                            <td class="text-center">{{ (current_page == 1 ? 0 : ((current_page - 1) * 10)) +
                                    (index
                                        + 1)
                            }}</td>
                            <td>{{ val.m_attendance_spots_name }}</td>
                            <td class="text-center">{{ val.count_personel }}</td>
                            <td>{{ val.m_attendance_spots_address }}</td>
                            <td class="text-center">
                                <div class="btn-group">
                                    <router-link :to="{
                                        name: 'detailPersonelAttendanceSpot',
                                        params: { id: val.id_m_attendance_spots },
                                        query: {
                                            page: current_page
                                        }
                                    }" class="btn-light">
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Penempatan Personel">
                                            <i class="material-icons">group</i>
                                        </button>
                                    </router-link>
                                    <!-- <router-link :to="{
                                name: 'detailPersonelAttendanceSpot',
                                params: { id: val.id_m_attendance_spots },
                              }" class="btn-light">
                                <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                  data-placement="right" title="Detail">
                                  <i class="material-icons">visibility</i>
                                </button>
                              </router-link> -->
                                    <router-link :to="{
                                        name: 'editAttendanceSpot',
                                        params: { id: val.id_m_attendance_spots },
                                    }" class="btn-light">
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Edit">
                                            <i class="material-icons">edit</i>
                                        </button>
                                    </router-link>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Hapus" @click="
                                            confirmDelete(
                                                val.id_m_attendance_spots,
                                                val.m_attendance_spots_name
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
            paginate: [1]
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
                .get(env.VITE_API_URL + "attendance-spot", {
                    params: {
                        page: this.current_page,
                        show: this.show,
                        search: search,
                        pagination: true,
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
        confirmDelete(id, nama) {
            return Api.confirmDelete(
                "Apakah anda yakin?",
                "Attendance Spot " + nama + " akan dihapus!"
            ).then((result) => {
                if (result.isConfirmed) {
                    this.deleteAttendanceSpot(id);
                }
            });
        },
        deleteAttendanceSpot(id) {
            axios
                .delete(env.VITE_API_URL + "attendance-spot/" + id)
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