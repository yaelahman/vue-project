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
                            <th>Departemen</th>
                            <th>Tanggal Pengajuan</th>
                            <th>Jumlah Hari</th>
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
                            <td style="text-align: start">
                                {{ val.personel.m_personel_names }}
                            </td>
                            <td>
                                {{ val.personel.departemen.m_departemen_name }}
                            </td>
                            <td v-if="val.created_at != null">
                                {{ convertDate(val.created_at, "DD-MM-YYYY", '-', true) }}
                            </td>
                            <td v-else class="text-center">-</td>
                            <td>
                                {{ jumlahHari(val) }}
                            </td>
                            <td class="text-nowrap">
                                <div v-html="mapStatus(val.permit_status)"></div>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <router-link :to="{
                                        name: 'detailIzinCuti',
                                        params: {
                                            id: val.id_permit_application,
                                        },
                                        query: {
                                            page: current_page,
                                            ...query
                                        }
                                    }" class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right"
                                        title="Detail">
                                        <i class="material-icons">remove_red_eye</i>
                                    </router-link>
                                    <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                        data-placement="right" title="Hapus" @click="
                                            confirmDelete(val.id_permit_application)
                                        ">
                                        <i class="material-icons">delete</i>
                                    </button>
                                    <div v-if="val.permit_status == 0" style="display: contents">
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Setuju" data-bs-toggle="modal"
                                            data-bs-target="#ModalCatatan" @click="
                                                Modal(val.id_permit_application, 'setuju')
                                            ">
                                            <i class="material-icons">check</i>
                                        </button>
                                        <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                            data-placement="right" title="Tolak" data-bs-toggle="modal"
                                            data-bs-target="#ModalCatatan" @click="
                                                Modal(val.id_permit_application, 'tolak')
                                            ">
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
        <div class="modal fade" id="ModalCatatan" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="text-center">
                            Silahkan input catatan dari admin pada kolom di bawah ini:
                        </p>
                    </div>
                    <div class="mx-5">
                        <textarea class="form-control" v-model="modal.catatan" cols="30" rows="10"
                            placeholder="Catatan dari admin"></textarea>
                    </div>
                    <div class="modal-footer text-center">
                        <div class="mx-auto">
                            <button type="button" class="btn rounded-pill btn-light me-2 btn-cancel"
                                data-bs-dismiss="modal">
                                Kembali
                            </button>
                            <button type="button" @click="permitApprove()"
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
import * as Api from "../../../helper/Api.js";
import moment from "moment";
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
            paginate: [1],
            modal: {
                catatan: "",
                type: "",
                id: "",
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
                this.query.page = page
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
                .get(env.VITE_API_URL + "izin/get/3", {
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
        jumlahHari(val) {
            var start = val.permit_startclock;
            var end = val.permit_endclock;
            if (start != null) {
                var a = moment(moment(start).toArray());
                var b = moment(moment(end).toArray());
                var result = b.diff(a, "d");
                return (result < 0 ? 0 : result + 1) + " Hari";
            }
            return val.permit_date.length + " Hari";
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
                    break;
            }
        },
        confirmDelete(id) {
            return Api.confirmDelete(
                "Apakah anda yakin?",
                "Data izin akan dihapus!"
            ).then((result) => {
                if (result.isConfirmed) {
                    this.deletePermit(id);
                }
            });
        },
        deletePermit(id) {
            axios
                .delete(env.VITE_API_URL + "izin/3/" + id)
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
        Modal(id, type = "") {
            this.modal = {
                id: id,
                type: type,
            };
        },
        permitApprove(type = null) {
            if (type != null) {
                this.modal.id = this.id;
                this.modal.type = type;
            }
            $(".btn-submit").attr("disabled", true);
            // $('.btn-submit').attr('disabled', true)
            axios
                .post(env.VITE_API_URL + "izin/approve", this.modal)
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
    }
}
</script>