<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>{{ id != "" ? "Update Karyawan" : "Tambah Karyawan" }}</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <form class="mt-3" @submit.prevent="createDataPersonel()">
                    <div class="mb-3">
                      <div class="mt-0" v-if="id != ''">

                        <router-link :to="{
                          name: 'showDataPersonel', params: { id: id },
                          query: $route.query
                        }" class="btn btn-light border rounded-pill btn-back">
                          <i class="material-icons">arrow_back</i>Kembali
                        </router-link>
                      </div>
                      <div class="mt-0" v-else>

                        <router-link to="/index-data-personel" class="btn btn-light border rounded-pill btn-back">
                          <i class="material-icons">arrow_back</i>Kembali
                        </router-link>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Nama Personel</label>
                      <input type="text" class="form-control" v-model="data_personel.m_personel_names"
                        placeholder="Nama Personel" required
                        oninvalid="this.setCustomValidity('Nama Personel harus diisi')"
                        oninput="setCustomValidity('')" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Personel ID</label>
                      <input type="number" pattern="[a-zA-Z0-9 ]+" class="form-control"
                        v-model="data_personel.m_personel_personID" placeholder="Personel ID" required
                        oninvalid="this.setCustomValidity('Personel ID harus diisi')" oninput="setCustomValidity('')" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Username</label>
                      <input type="text" class="form-control" v-model="data_personel.username" placeholder="Username"
                        required oninvalid="this.setCustomValidity('Username harus diisi')"
                        oninput="setCustomValidity('')" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Jenis Kelamin</label>
                      <select class="form-select" v-model="data_personel.m_personel_gender" required
                        oninvalid="this.setCustomValidity('Jenis Kelamin harus diisi')" oninput="setCustomValidity('')">
                        <option value="" disabled>
                          -- Pilih Jenis Kelamin --
                        </option>
                        <option value="1">Laki-laki</option>
                        <option value="2">Perempuan</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" v-model="data_personel.m_personel_email"
                        placeholder="Email" required oninvalid="this.setCustomValidity('Email harus diisi')"
                        oninput="setCustomValidity('')" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Departemen</label>
                      <select class="form-select" v-model="data_personel.id_m_departemen" required
                        placeholder="Departemen" oninvalid="this.setCustomValidity('Departemen harus diisi')"
                        oninput="setCustomValidity('')">
                        <option value="" disabled>
                          -- Pilih Departemen --
                        </option>
                        <option v-for="val in departemens" :key="val.id" v-bind:value="val.id_m_departemen">
                          {{ val.m_departemen_name }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Jumlah Cuti</label>
                      <input type="number" min="0" class="form-control" v-model="data_personel.total_leave"
                        placeholder="Jumlah Cuti" required oninvalid="this.setCustomValidity('Jumlah Cuti harus diisi')"
                        oninput="setCustomValidity('')" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Tanggal Kadaluarsa Cuti</label>
                      <input type="date" class="form-control" v-model="data_personel.effective_date_leave"
                        placeholder="Tanggal Kadaluarsa Cuti" required
                        oninvalid="this.setCustomValidity('Tanggal Kadaluarsa Cuti harus diisi')"
                        oninput="setCustomValidity('')" />
                    </div>
                    <!-- <div class="form-group">
                      <label class="form-label">Status</label>
                      <select class="form-select" v-model="data_personel.m_personel_status" required
                        placeholder="Status" oninvalid="this.setCustomValidity('Status harus diisi')"
                        oninput="setCustomValidity('')">
                        <option value="" disabled>
                          -- Pilih Status --
                        </option>
                        <option value="1">On</option>
                        <option value="2">Off</option>
                      </select>
                    </div> -->
                    <div class="form-group">
                      <div class="mt-3">
                        <button type="submit" id="submit" class="btn btn-primary">
                          <i class="material-icons">save</i>{{ title }}
                        </button>
                      </div>
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
      data_personel: {
        m_personel_gender: "",
        id_m_departemen: "",
        m_personel_status: ""
      },
      departemens: [],
      attendance_spot: {},
      title: "Tambah",
      id: "",
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.id = this.id != null ? this.id : "";
    this.loadDepartemen();
    this.loadDataPersonel();
  },
  methods: {
    loadDepartemen() {
      axios
        .get(env.VITE_API_URL + "index-departemen?=1000")
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
    createDataPersonel() {
      $("#submit").prop("disabled", true);
      $("#submit").html("Loading...");

      axios
        .post(env.VITE_API_URL + "create-edit-data-personel", {
          id: this.id,
          data_personel: this.data_personel,
        })
        .then((response) => {
          if (Api.response(response.data) === Api.STATUS_SUCCESS) {
            if (this.id != '') {
              let query = this.$route.query
              this.$router.push({
                name: 'showDataPersonel', params: { id: this.id },
                query: query
              });
            } else {
              this.$router.push("/index-data-personel");
            }
          }
          $("#submit").prop("disabled", false);
          $("#submit").html("Simpan");
        })
        .catch((e) => {
          Api.messageError(e);
          $("#submit").prop("disabled", false);
          $("#submit").html("Simpan");
        });
    },
    loadDataPersonel() {
      this.id = this.$route.params.id;
      this.id = this.id != null ? this.id : "";
      if (this.id != "") {
        this.$Progress.start();
        this.title = "Simpan";
        axios
          .get(env.VITE_API_URL + "show-data-personel/" + this.id)
          .then((response) => {
            if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
              this.$Progress.finish();
              this.data_personel = response.data.data;
              if (this.data_personel.id_m_departemen == null) {
                this.data_personel.id_m_departemen = "";
              }
            }
          })
          .catch((e) => {
            this.$Progress.fail();
            Api.messageError(e);
          });
      }
    },
  },
};
</script>