<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Pengaturan Perangkat</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="card">
                <form @submit.prevent="saveSetting">
                  <div class="card-header d-flex justify-content-start">
                    <button type="submit" id="submit" class="btn btn-primary">
                      <i class="material-icons">save</i>Simpan Perubahan
                    </button>
                  </div>
                  <div class="card-body">
                    <div class="row mb-3">
                      <!-- <div class="form-group mb-3">
                        <label class="fw-bolder">Denda <small class="text-danger">*Per Menit</small></label>
                        <input type="number" min="0" required v-model="device_settings.m_device_settings_denda" class="form-control">
                      </div> -->
                      <div class="">
                        <h5 class="bg-light rounded p-3">Absensi</h5>
                        <div class="card-body py-0">
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_absensiCamera
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Camera</label
                            >
                          </div>
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_absensiFaceRecognition
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Face Recognition</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="">
                        <h5 class="bg-light rounded p-3">Visit Client</h5>
                        <div class="card-body py-0">
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_visitCamera
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Camera</label
                            >
                          </div>
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_visitFaceRecognition
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Face Recognition</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="">
                        <h5 class="bg-light rounded p-3">Overtime</h5>
                        <div class="card-body py-0">
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_overtimeCamera
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Camera</label
                            >
                          </div>
                          <div
                            class="form-check form-switch"
                            style="margin-left: 10px"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              checked
                              v-model="
                                device_settings.m_device_settings_overtimeFaceRecognition
                              "
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckChecked"
                              >Face Recognition</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div style="position: relative;">
                        <hr>
                        <h5 class="bg-light rounded p-3">Denda Terlambat</h5>
                        <div class="card-body py-0">
                          <label style="position: absolute; display: block; right: 5%; top: 75%; z-index: 9;">/menit</label>
                          <div class="row w-100">
                            <div class="pt-2" style="width: 5%;">
                              <label>Rp</label>
                            </div>
                            <div style="width: 90%;">                          
                              <input type="number" min="0" class="form-control" required placeholder="Denda terlambat" v-model="device_settings.m_device_settings_denda">
                            </div>                            
                          </div>
                        </div>
                    </div>
                  </div>
                    <!-- <div class="example-content">
                      <div class="d-flex justify-content-between">
                        <label style="font-size: 1.3em">Kamera</label>
                        <label class="switch">
                          <input
                            type="checkbox"
                            v-model="device_settings.m_device_settings_camera"
                          />
                          <span class="slider"></span>
                        </label>
                      </div>
                    </div> -->
                  </div>
                </form>
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
      device_settings: {},
    };
  },
  created() {
    this.loadDeviceSettings();
  },
  mounted() {},
  methods: {
    loadDeviceSettings() {
      this.$Progress.start();
      axios
        .get(env.VITE_API_URL + "detail-device-settings")
        .then((response) => {
          if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
            this.$Progress.finish();
            this.device_settings = response.data.data;
          }
        })
        .catch((e) => {
          this.$Progress.fail();
          Api.messageError(e);
        });
    },
    saveSetting() {
      $("#submit").prop("disabled", true);
      $("#submit").html("Loading...");

      axios
        .post(env.VITE_API_URL + "update-device-settings", {
          device_settings: this.device_settings,
        })
        .then((response) => {
          if (Api.response(response.data) === Api.STATUS_SUCCESS) {
            this.loadDeviceSettings();
          }
          $("#submit").prop("disabled", false);
          $("#submit").html(
            `<i class="material-icons">save</i>Simpan Perubahan`
          );
        })
        .catch((error) => {
          $("#submit").prop("disabled", false);
        });
    },
  },
};
</script>
