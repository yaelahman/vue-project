<template>
    <div>
        <div class="app-content">
            <div class="content-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col">
                            <div class="page-description">
                                <h1>{{ title }} Personel</h1>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="card">
                                <div class="card-header"></div>
                                <div class="card-body">
                                    <form @submit.prevent="createPersonelTimeWork()">
                                        <div class="example-content">
                                            <label>Personel</label>
                                            <select class="form-select" v-model="personel_time_work.id_m_personel"
                                                :disabled="update == true" required
                                                oninvalid="this.setCustomValidity('Personel harus diisi')"
                                                oninput="setCustomValidity('')">
                                                <option value="" disabled>-- Pilih Personel --</option>
                                                <option v-for="val in personels" :key="val.id"
                                                    v-bind:value="val.id_m_personel">
                                                    {{ val.m_personel_names }}
                                                </option>
                                            </select>
                                        </div>

                                        <div class="example-content">
                                            <label>Daftar Jadwal</label>
                                            <select class="form-select" v-model="personel_time_work.id_m_work_patern"
                                                required oninvalid="this.setCustomValidity('Daftar Jadwal harus diisi')"
                                                oninput="setCustomValidity('')">
                                                <option value="" disabled>-- Pilih Work Pattern --</option>
                                                <option v-for="val in work_patterns" :key="val.id"
                                                    v-bind:value="val.id_m_work_patern">
                                                    {{ val.m_work_patern_name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="example-content">
                                            <label class="form-label">Tanggal di Mulai</label>
                                            <input type="date" class="form-control"
                                                v-model="personel_time_work.m_work_personel_time"
                                                placeholder="Tanggal di Mulai" required
                                                oninvalid="this.setCustomValidity('Tanggal di Mulai harus diisi')"
                                                oninput="setCustomValidity('')">
                                        </div>
                                        <div class="example-content mt-3">
                                            <button type="submit" class="btn btn-primary" id="submit">
                                                <i class="material-icons">save</i>Simpan
                                            </button>
                                            <router-link v-if="create != null" :to="{
                                                name: 'detailWorkPattern',
                                                params: {
                                                    id: create,
                                                },
                                            }" type="button" class="btn btn-light">
                                                <i class="material-icons">arrow_back</i>Kembali
                                            </router-link>
                                            <router-link v-else :to="{
                                                path: '/index-personel-time-work',
                                                query: $route.query
                                            }" type="button" class="btn btn-light">
                                                <i class="material-icons">arrow_back</i>Kembali
                                            </router-link>
                                        </div>
                                    </form>
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
            id: '',
            title: 'Tambah',
            update: false,
            personel_time_work: {
                id_m_personel: "",
                id_m_work_patern: ''
            },
            personels: {},
            work_patterns: {},
            create: null,
        };
    },
    mounted() {
        this.id = this.$route.params.id
        this.id = this.id != null ? this.id : ''
        if (this.id != '' && this.id != null) {
            $('#submit').html('Update')
        }

        this.update = this.$route.params.update
    },
    async created() {
        this.create = this.$route.params.create != null ? this.$route.params.create : null
        // alert(this.id)
        this.loadPersonel();
        this.loadWorkPattern();
        await this.loadPersonelTimeWork();
    },
    methods: {
        async loadPersonelTimeWork() {
            this.id = this.$route.params.id
            this.id = this.id != null ? this.id : ''
            if (this.id != '') {
                this.$Progress.start()
                this.title = 'Update'
                await axios.get(env.VITE_API_URL + 'detail-personel-time-work/' + this.id).then(response => {
                    if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                        this.$Progress.finish()
                        this.personel_time_work = response.data.data
                        this.personel_time_work.m_work_personel_time = Api.convertDate(this.personel_time_work.m_work_personel_time, 'YYYY-MM-DD')
                    }
                })
                    .catch(e => {
                        this.$Progress.fail()
                        Api.messageError(e)
                    })
            } else {
                console.log(this.$route.params)
                if (this.$route.params != null && this.$route.params.create) {

                    this.personel_time_work.id_m_work_patern = this.$route.params.create
                }
            }
        },
        createPersonelTimeWork() {
            $('#submit').prop('disabled', true);
            $('#submit').html('Loading...');

            axios.post(env.VITE_API_URL + 'create-edit-personel-time-work', {
                id: this.id,
                personel_time_work: this.personel_time_work
            }).then(response => {
                if (Api.response(response.data) === Api.STATUS_SUCCESS) {
                    // alert(this.id, this.create)
                    if (this.id != '') {

                        this.$router.push({
                            path: "/index-personel-time-work/",
                            query: this.$route.query
                        })
                    } else {
                        this.$router.push("/detail-work-pattern/" + this.$route.params.create)

                    }
                }
                $('#submit').prop('disabled', false);
                $('#submit').html('Submit');
            })
                .catch(e => {
                    Api.messageError(e)
                    $('#submit').prop('disabled', false);
                })
        },
        loadPersonel() {
            this.update = this.$route.params.update
            if (this.id != null) {
                axios.get(env.VITE_API_URL + "get-edit-personel", {
                    params: {
                        except: this.$route.params.id
                    }
                }).then(response => {
                    if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                        this.personels = response.data.data;
                    }
                })
                    .catch(e => {
                        Api.messageError(e);
                    });
            } else {
                axios.get(env.VITE_API_URL + "get-personel").then(response => {
                    if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                        this.personels = response.data.data;
                    }
                })
                    .catch(e => {
                        Api.messageError(e);
                    });
            }
        },
        loadWorkPattern() {
            axios.get(env.VITE_API_URL + 'index-work-pattern?show=1000').then(response => {
                if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
                    this.work_patterns = response.data.data.data
                }
            })
                .catch(e => {
                    Api.messageError(e)
                })
        },
    }
};
</script>
