<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>{{ title }} Daftar Jadwal</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">

                  <router-link :to="{
                    name: 'createPersonelTimeWork',
                    params: {
                      id: id,
                    },
                  }" class="btn btn-primary">
                    <i class="material-icons">add</i> Tambah
                  </router-link>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table id="dt-timework" class="display nowrap w-100">
                      <thead class="text-center text-nowrap">
                        <tr>
                          <th>No</th>
                          <th style="text-align: start">Nama</th>
                          <th>Departemen</th>
                          <th>Daftar Jadwal</th>
                          <th>Mulai</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style="text-align: center" v-for="(
                            personel_time_work, index
                          ) in personel_time_works" :key="index">
                          <td>{{ index + 1 }}</td>
                          <td style="width: 10px; text-align: start">
                            {{
                            personel_time_work.get_personel.m_personel_names
                            }}
                          </td>
                          <td>
                            {{
                            personel_time_work.get_personel.departemen != null
                            ? personel_time_work.get_personel.departemen
                            .m_departemen_name
                            : "-"
                            }}
                          </td>
                          <td>
                            {{ personel_time_work.get_work_pattern
                            .m_work_patern_name }}
                          </td>
                          <td>
                            {{ convertDate(personel_time_work.m_work_personel_time) }}
                          </td>
                          <td class="text-center">
                            <div class="btn-group">
                              <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                data-placement="right" title="Edit">
                                <router-link :to="{
                                  name: 'editPersonelTimeWork',
                                  params: {
                                    id: personel_time_work.id_m_work_personel,
                                    update: true,
                                  },
                                  query: {
                                    update:true
                                  },
                                }" class="btn-light">
                                  <i class="material-icons">edit</i>
                                </router-link>
                              </button>
                              <button type="button" class="btn btn-sm btn-light" data-toggle="tooltip"
                                data-placement="right" title="Hapus" @click="
                                  confirmDelete(
                                    personel_time_work.id_m_work_personel,
                                    personel_time_work.get_work_pattern
                                      .m_work_patern_name
                                  )
                                ">
                                <i class="material-icons">delete</i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-5">
                    <router-link to="/index-work-pattern" class="btn btn-light">
                      <i class="material-icons">arrow_back</i>Kembali
                    </router-link>
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
      id: this.$route.params.id,
      title: 'Detail',
      m_work_patern_numberCycle: '',
      work_schedule: [],
      work_pattern: {},
      personel_time_works: {},
      table: null,
    };
  },
  created() {
    this.loadWorkPattern();
    this.loadPersonelTimeWork();
  },
  mounted() {
    setTimeout(() => {
      this.table = $("#dt-timework").DataTable({ autoWidth: false });
    }, 1000);
  },
  methods: {
    loadWorkPattern() {
      this.id = this.$route.params.id;
      this.id = this.id != null ? this.id : "";
      if (this.id != "") {
        this.$Progress.start()
        axios.get(env.VITE_API_URL + "detail-work-pattern/" + this.id).then(response => {
          this.$Progress.finish()
          this.work_pattern = response.data.data;
          this.m_work_patern_numberCycle = response.data.data.m_work_patern_numberCycle;
          this.work_schedule = response.data.data.get_work_schedule;
        })
          .catch(e => {
            this.$Progress.fail()
            Api.messageError(e);
          });
      }
    },
    loadPersonelTimeWork() {
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "index-personel-time-work", {
          params: {
            id_work_pattern: this.id
          }
        })
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.$Progress.finish();
            this.personel_time_works = response.data.data;
            this.table.destroy();
            this.$nextTick(() => {
              this.table = $("#dt-timework").DataTable({ autoWidth: false });
            });
          }
        })
        .catch((e) => {
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    confirmDelete(id, name) {
      return Api.confirmDelete(
        "Apakah anda yakin?",
        "Jadwal Karyawan dengan personel " + name + " akan dihapus!"
      ).then((result) => {
        if (result.isConfirmed) {
          this.deleteCompany(id);
        }
      });
    },
  }
};
</script>
