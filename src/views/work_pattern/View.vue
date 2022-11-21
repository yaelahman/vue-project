<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Detail Personel</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <router-link :to="{
                    path: '/index-work-pattern',
                    query: $route.query
                  }" class="btn btn-light">
                    <i class="material-icons">arrow_back</i>Kembali
                  </router-link>

                  <router-link :to="{
                    name: 'createPersonelTimeWork',
                    params: {
                      create: id,
                    },
                  }" class="btn btn-primary float-end">
                    <i class="material-icons">add</i> Tambah
                  </router-link>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <TableView />
                  </div>
                  <div class="mt-5">
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
import TableView from "./TableView.vue";
export default {
  data() {
    return {
      id: this.$route.params.id,
      title: "Detail",
      m_work_patern_numberCycle: "",
      work_schedule: [],
      work_pattern: {},
      personel_time_works: {},
      table: null,
    };
  },
  components: { TableView }
};
</script>
