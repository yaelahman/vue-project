<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Jadwal Karyawan</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <!-- <div class="card-header">
                  <router-link
                    to="/create-personel-time-work"
                    class="btn btn-primary"
                  >
                    <i class="material-icons">add</i>Tambah
                  </router-link>
                </div> -->
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
import Table from "./Table.vue";
export default {
  data() {
    return {
      personel_time_works: {},
      table: null,
    };
  },
  components: { Table }
};
</script>
