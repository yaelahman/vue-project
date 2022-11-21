<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Lokasi Kehadiran</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <router-link to="/attendance-spot/create" class="btn btn-primary">
                    <i class="material-icons">add</i>Tambah
                  </router-link>
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
import Table from "./Table.vue";
export default {
  data() {
    return {
      attendance_spot: {},
      table: null,
    };
  },
  components: { Table }
};
</script>