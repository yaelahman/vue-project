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
                            <th style="text-align: start;">Nama</th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>DeviceID</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody v-if="!isLoading">
                        <tr v-for="(val, index) in data.data" :key="index" class="odd">
                            <td class="text-center">{{ (current_page == 1 ? 0 : ((current_page - 1) * 10)) +
                                    (index
                                        + 1)
                            }}</td>
                            <td style="width: 10px; text-align: start;">{{ val.m_personel_names }}</td>
                            <td>{{ val.m_personel_personID }}</td>
                            <td>{{ val.username }}</td>
                            <td>{{ val.m_personel_email }}</td>
                            <td>{{ val.device_id }}</td>
                            <td>
                                <button style="cursor: pointer;" @click="changeStatus(val)"
                                    :class="val.m_personel_status == 1 ? 'btn btn-success btn-sm' : 'btn btn-danger btn-sm'">{{
                                            val.m_personel_status == 1 ? 'On' : 'Off'
                                    }}</button>
                            </td>
                            <td class="text-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Generate Password" @click="confirmGenerate(
                                            val.id_m_personel,
                                            val.m_personel_names,
                                            val.m_personel_personID,
                                            val.m_personel_password_show
                                        )">
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M11.0273 13.4258L9.69141 14.6914C9.55078 14.9023 9.3125 15 9.0625 15H7.5V16.5625C7.5 17.082 7.08203 17.5 6.5625 17.5H5V19.0625C5 19.582 4.58203 20 4.0625 20H0.9375C0.419922 20 0 19.582 0 19.0625V15.9375C0 15.6875 0.0987891 15.4492 0.27457 15.2734L6.57422 8.97266C6.36328 8.3125 6.25 7.60547 6.25 6.875C6.25 3.07812 9.32812 0 13.125 0C16.9219 0 20 3.07812 20 6.875C20 10.6719 16.9219 13.75 13.125 13.75C12.3945 13.75 11.6875 13.6367 11.0273 13.4258ZM14.6875 6.875C15.5508 6.875 16.25 6.17578 16.25 5.3125C16.25 4.44922 15.5508 3.75 14.6875 3.75C13.8242 3.75 13.125 4.44922 13.125 5.3125C13.125 6.17578 13.8242 6.875 14.6875 6.875Z"
                                                fill="#4D546B" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Reset Device" @click="confirmResetDeviceID(
                                            val.id_m_personel,
                                            val.m_personel_personID,
                                            val.m_personel_names,
                                            val.device_id
                                        )">
                                        <svg width="14" height="auto" viewBox="0 0 16 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.20005 0.400391C2.56353 0.400391 1.95308 0.653247 1.50299 1.10333C1.05291 1.55342 0.800049 2.16387 0.800049 2.80039V17.2004C0.800049 17.8369 1.05291 18.4474 1.50299 18.8974C1.95308 19.3475 2.56353 19.6004 3.20005 19.6004H12.8C13.4366 19.6004 14.047 19.3475 14.4971 18.8974C14.9472 18.4474 15.2 17.8369 15.2 17.2004V2.80039C15.2 2.16387 14.9472 1.55342 14.4971 1.10333C14.047 0.653247 13.4366 0.400391 12.8 0.400391H3.20005ZM8.00005 17.2004C8.31831 17.2004 8.62353 17.074 8.84858 16.8489C9.07362 16.6239 9.20005 16.3187 9.20005 16.0004C9.20005 15.6821 9.07362 15.3769 8.84858 15.1519C8.62353 14.9268 8.31831 14.8004 8.00005 14.8004C7.68179 14.8004 7.37656 14.9268 7.15152 15.1519C6.92648 15.3769 6.80005 15.6821 6.80005 16.0004C6.80005 16.3187 6.92648 16.6239 7.15152 16.8489C7.37656 17.074 7.68179 17.2004 8.00005 17.2004V17.2004Z"
                                                fill="#4D546B" />
                                        </svg>
                                    </button>
                                    <button class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right"
                                        title="View">
                                        <router-link :to="{
                                            name: 'showDataPersonel',
                                            params: { id: val.id_m_personel },
                                            query: {
                                                page: current_page,
                                                ...$route.query
                                            }
                                        }">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 16.5C9.24 16.5 7 14.26 7 11.5C7 8.74 9.24 6.5 12 6.5C14.76 6.5 17 8.74 17 11.5C17 14.26 14.76 16.5 12 16.5ZM12 8.5C10.34 8.5 9 9.84 9 11.5C9 13.16 10.34 14.5 12 14.5C13.66 14.5 15 13.16 15 11.5C15 9.84 13.66 8.5 12 8.5Z"
                                                    fill="#4d546b" />
                                            </svg>
                                        </router-link>
                                    </button>
                                    <!-- <button class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right" title="Edit">
                                <router-link :to="{ name: 'editDataPersonel', params: { id: val.id_m_personel }}">
                                  <i class="material-icons" style="color: #4d546b;">edit</i>
                                </router-link>
                              </button> -->
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Hapus" @click="confirmDelete(
                                            val.id_m_personel,
                                            val.m_personel_names,
                                            val.m_personel_personID
                                        )">
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
                .get(env.VITE_API_URL + "index-data-personel", {
                    params: {
                        page: this.current_page,
                        show: this.show,
                        search: search,
                        isIndex: 1,
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
        }, confirmGenerate(id, nama, personID, password) {
            if (password == null) {
                this.generatePassword(id);
            } else {
                return Api.confirmGenerate(
                    "Apakah anda yakin?",
                    "Data Personel ID " +
                    personID +
                    " dan nama " +
                    nama +
                    " akan digenerate lagi!"
                ).then((result) => {
                    if (result.isConfirmed) {
                        this.generatePassword(id);
                    }
                });
            }
        },
        generatePassword(id) {
            axios
                .get(env.VITE_API_URL + "generate-password-data-personel/" + id)
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
                    Swal.fire({
                        title: '<h5 class="text-success">Berhasil</h5>',
                        text: message,
                        icon: 'success',
                        html: `
            <div class="input-group mb-3">
              <input type="text" class="form-control copy-text" value="${response.data.data.m_personel_password_show}" disabled required>
              <span class="input-group-text btn-copy-text" style="cursor: pointer">Salin</span>
            </div>
            `,
                        // input: 'text',
                        // inputValue: response.data.data.m_personel_password_show,
                        // inputAttributes: {
                        //   autocapitalize: 'off',
                        //   disabled: true,
                        // },
                        confirmButtonColor: '#3085d6',
                        // onBeforeOpen: function (ele) {
                        //   $(ele).find('button.swal2-confirm.swal2-styled')
                        //     .toggleClass('swal2-confirm swal2-styled swal2-confirm btn btn-success')
                        // },
                        customClass: {
                            confirmButton: 'w-100'
                        },
                    });
                })
                .catch((e) => {
                    Api.messageError(e);
                });
        },
        confirmResetDeviceID(id, personID, nama, deviceID) {
            if (deviceID == null) {
                this.resetDeviceID(id);
            } else {
                return Api.confirmGenerate(
                    "Apakah anda yakin?",
                    "Data Personel ID " +
                    personID +
                    " dan nama " +
                    nama +
                    " akan direset!",
                    "warning",
                    "Iya, reset!"
                ).then((result) => {
                    if (result.isConfirmed) {
                        this.resetDeviceID(id);
                    }
                });
            }
        },
        resetDeviceID(id) {
            axios
                .get(env.VITE_API_URL + "reset-deviceid-data-personel/" + id)
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
        confirmDelete(id, nama, personID) {
            // console.log(id, nama, personID);
            return Api.confirmDelete(
                "Apakah anda yakin?",
                "Data Personel ID " + personID + " dan nama " + nama + " akan dihapus!"
            ).then((result) => {
                if (result.isConfirmed) {
                    this.deleteDataPersonel(id);
                }
            });
        },
        deleteDataPersonel(id) {
            // console.log(id);
            axios
                .delete(env.VITE_API_URL + "delete-data-personel/" + id)
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
        changeStatus(val) {
            return Api.confirmGenerate(
                "Apakah anda yakin?",
                "Data Personel ID " +
                val.m_personel_personID +
                " dan nama " +
                val.m_personel_names +
                " akan " + (val.m_personel_status == 1 ? 'dinonaktifkan' : 'diaktifkan'),
                'warning',
                'Iya'
            ).then((result) => {
                if (result.isConfirmed) {
                    axios
                        .get(env.VITE_API_URL + "change-status-data-personel/" + val.id_m_personel)
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
                }
            });
        },
    }
}
</script>