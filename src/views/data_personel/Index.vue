<template lang="">
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Data Karyawan</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <router-link to="/create-data-personel" class="btn btn-primary">
                    <i class="material-icons">add</i>Tambah
                  </router-link>
                  <br>
                  <div class="mt-2">
                    <form @submit.prevent="search()">
                      <div class="row">
                        <div class="col-sm-3">
                          <div class="form-group">
                            <label>Departemen:</label>
                            <select v-model="departemen"  class="form-control">
                              <option value="" selected>Semua</option>
                              <option v-for="(val, index) in departemens" :key="index" :value="val.id_m_departemen">{{ val.m_departemen_name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-sm-3">
                          <div class="form-group">
                            <label>Jadwal Kerja:</label>
                            <select v-model="work_patern"  class="form-control">
                              <option value="" selected>Semua</option>
                              <option v-for="(val, index) in work_paterns" :key="index" :value="val.id_m_work_patern">{{ val.m_work_patern_name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-3 col-md-4 col-sm-4 col-12 d-flex" style="margin-top: 1.8rem">
                          <button class="btn btn-sm text-nowrap btn-primary mb-2 me-2" style="width: 120px">
                            Tampilkan
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <Table />
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
import Swal from "sweetalert2"
import Table from "./Table.vue";
export default {
  data() {
    return {
      personels: {},
      table: null,
      departemen: "",
      departemends: [],
      work_paterns: [],
      work_patern: ""
    };
  },
  components: { Table },
  created() {
    this.departemen = this.$route.query.departemen ?? ''
    this.work_patern = this.$route.query.work_patern ?? ''
  },
  mounted() {
    this.loadDepartemen()
    this.loadWorkPattern()

    $(document).on('click', '.btn-copy-text', function () {
      var value = $('.copy-text').val(); //Upto this I am getting value

      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(value).select();
      document.execCommand("copy");
      $temp.remove();

      Swal.fire({
        icon: 'success',
        title: 'Password berhasil disalin',
        text: value,
        showConfirmButton: false,
        timer: 3000
      });
    })
  },
  methods: {
    loadWorkPattern() {
      axios.get(env.VITE_API_URL + 'index-work-pattern?show=1000').then(response => {
        if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
          this.work_paterns = response.data.data.data
        }
      })
        .catch(e => {
          Api.messageError(e)
        })
    },
    loadDepartemen() {
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "index-departemen?show=1000")
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.$Progress.finish();
            this.departemens = response.data.data.data;
          }
        })
        .catch((e) => {
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    search() {
      this.$router.push({
        path: '/index-data-personel',
        query: {
          departemen: this.departemen,
          work_patern: this.work_patern,
        }
      })
    },
    convertDate(date, format = "DD-MM-YYYY", empty = "-", subtract = false) {
      return Api.convertDate(date, format, empty, subtract);
    },
  },
};
</script>