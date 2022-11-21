<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Daftar Jadwal</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="card-header">
                  <router-link to="/create-work-pattern" class="btn btn-primary">
                    <i class="material-icons">add</i>Tambah
                  </router-link>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <TableVue />
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
import TableVue from './Table.vue';
export default {
  data() {
    return {
      work_patterns: {},
      table: null,
    };
  },
  created() {
    // this.loadWorkPattern();
  },
  components: {
    TableVue
  },
};
</script>