<template lang="">
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Faq</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <router-link to="/create-faq" class="btn btn-primary">
                    <i class="material-icons">add</i>Tambah
                  </router-link>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table id="dt-1" class="display w-100" style="width:100%">
                      <thead class="text-center">
                        <tr>
                          <th>No</th>
                          <th>Kategori</th>
                          <th>Pertanyaan</th>
                          <th>Jawaban</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(faq, index) in faqs" :key="index">
                          <td class="text-center">{{index + 1}}</td>
                          <td>{{faq.kategori_faq == 1 ? 'Aplikasi' : 'Website'}}</td>
                          <td>{{faq.nama_m_faq}}</td>
                          <td>{{faq.jawaban_m_faq}}</td>
                          <td class="text-center">
                            <div class="btn-group">
                              <button class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right" title="Edit">
                                <router-link :to="{ name: 'editFaq', params: { id: faq.id_m_faq }}">
                                  <i class="material-icons" style="color: #4d546b;">edit</i>
                                </router-link>
                              </button>
                              <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip" data-placement="right" title="Hapus" @click="confirmDelete(
                                faq.id_m_faq)">
                                <i class="material-icons">delete</i>
                              </button>

                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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
export default {
  data() {
    return {
      faqs: [],
      table: null,
    };
  },
  created() {
    // this.loadDepartemen();
    this.loadFaq();
  },
  mounted() {
    setTimeout(() => {
      this.table = $("#dt-1").DataTable();
    }, 1000);
  },
  methods: {
    loadFaq() {
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "faq/get")
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.$Progress.finish();
            this.faqs = response.data.data;
            this.table.destroy();
            this.$nextTick(() => {
              this.table = $("#dt-1").DataTable();
            });
          }
        })
        .catch((e) => {
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    confirmDelete(id) {
      return Api.confirmDelete(
        "Apakah anda yakin?",
        "Faq akan dihapus!"
      ).then((result) => {
        if (result.isConfirmed) {
          this.deleteFaq(id);
        }
      });
    },
    deleteFaq(id) {
      axios
        .delete(env.VITE_API_URL + "faq/" + id)
        .then((response) => {
          this.loadFaq();
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
          console.log(e)
          Api.messageError(e);
        });
    },
  },
};
</script>