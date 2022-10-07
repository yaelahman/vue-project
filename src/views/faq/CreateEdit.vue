<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>{{ title }} Faq</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <form class="mt-3" @submit.prevent="createFaq()">
                    <div class="example-content">
                      <label class="form-label">Pertanyaan</label>
                      <input type="text" class="form-control" v-model="faq.nama_m_faq" placeholder="Pertanyaan"
                        required oninvalid="this.setCustomValidity('Pertanyaan harus diisi')" oninput="setCustomValidity('')">
                    </div>
                    <div class="example-content">
                      <label class="form-label">Jawaban</label>
                      <textarea class="form-control" v-model="faq.jawaban_m_faq" placeholder="Jawaban"
                        required oninvalid="this.setCustomValidity('Jawaban harus diisi')" oninput="setCustomValidity('')"></textarea>
                    </div>
                    <div class="example-content mt-3">
                      <button type="submit" class="btn btn-primary" id="submit">
                        <i class="material-icons">save</i>Simpan
                      </button>
                      <router-link to="/index-departemen" type="button" class="btn btn-light">
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
      id: "",
      faq: {},
      title: "Tambah",
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.id = this.id != null ? this.id : "";
    if (this.id != "" && this.id != null) {
      $("#submit").html("Update");
    }
  },
  created() {
    this.loadFaq();
  },
  methods: {
    createFaq() {
      $("#submit").prop("disabled", true);
      $("#submit").html("Loading...");

      axios.post(env.VITE_API_URL + "faq/store", {
        id: this.id,
        faq: this.faq,
      })
        .then((response) => {
          if (Api.response(response.data) === Api.STATUS_SUCCESS) {
            this.$router.push("/faq");
          }
          $("#submit").prop("disabled", false);
          $("#submit").html("Submit");
        })
        .catch((e) => {
          Api.messageError(e);
          $("#submit").prop("disabled", false);
        });
    },

    loadFaq() {
      this.id = this.$route.params.id;
      this.id = this.id != null ? this.id : "";
      if (this.id != "") {
        this.$Progress.start()
        this.title = "Update";
        axios.get(env.VITE_API_URL + "faq/show/" + this.id).then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.$Progress.finish()
            this.faq = response.data.data;
          }
        })
          .catch((e) => {
            this.$Progress.fail()
            Api.messageError(e);
          });
      }
    },
  },
};
</script>