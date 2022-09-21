<template>
  <div>
    <div class="app-content">
      <div class="content-wrapper">
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <div class="page-description">
                <h1>Tambah Lokasi Kehadiran</h1>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="row">
                <div class="col-xl-6">
                  <div class="card widget widget-list">
                    <div class="card-header">
                      <h5 class="card-title">Peta Lokasi</h5>
                    </div>
                    <div class="card-body">
                      <!-- <Map :left="left" :right="right" /> -->
                      <div classs="mb-1" style="height: 400px; width: 100%">
                        <place-search
                          v-model:ready="maps.ready"
                          placeholder="Enter a location"
                          loading="Map is loading"
                          v-bind:gps_timeout="7000"
                          v-model:fallbackProcedure="maps.fallbackProcedure"
                          v-model:zoom="maps.zoom"
                          v-model:geolocation="maps.geolocation"
                          v-model:address="maps.address"
                          v-model:manually="maps.manually"
                          @changed="getMapData"
                        >
                        </place-search>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="card widget widget-list">
                    <div class="card-body">
                      <form @submit.prevent="saveAttendanceSpot()">
                        <div class="local-maps"></div>
                        <div class="example-content">
                          <label class="form-label">Alamat</label>
                          <input type="text" class="form-control" v-model="attendance_spot.m_attendance_spots_address"
                            placeholder="Alamat" required oninvalid="this.setCustomValidity('Alamat diisi')"
                            oninput="setCustomValidity('')" />
                        </div>
                        <div class="example-content">
                          <label class="form-label">Nama Lokasi</label>
                          <input type="text" class="form-control" v-model="attendance_spot.m_attendance_spots_name"
                            placeholder="Nama Lokasi" required oninvalid="this.setCustomValidity('Nama Lokasi diisi')"
                            oninput="setCustomValidity('')" />
                        </div>
                        <div class="example-content">
                          <label class="form-label">Radius</label>
                          <select v-model.number="radius" class="form-control" required
                            oninvalid="this.setCustomValidity('Radius harus diisi')" oninput="setCustomValidity('')"
                            @change="addMarker()">
                            <option value="" disabled>
                              -- Pilih Radius --
                            </option>
                            <option value="10">10 Meter</option>
                            <option value="20">20 Meter</option>
                            <option value="30">30 Meter</option>
                            <option value="40">40 Meter</option>
                            <option value="50">50 Meter</option>
                            <option value="100">100 Meter</option>
                          </select>
                        </div>
                        <div class="example-content mt-3">
                          <button type="submit" id="submit" class="btn btn-primary">
                            <i class="material-icons">save</i>Simpan
                          </button>
                          <router-link to="/attendance-spot" class="btn btn-light">
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
    </div>
  </div>
</template>
<script>
import * as Api from "../../helper/Api.js";
export default {
  data() {
    return {
      currentPlace: null,
      markers: [],
      places: [],
      radius: "",
      attendance_spot: {
        m_attendance_spots_address: "",
        m_attendance_spots_name: "",
        m_attendance_spots_latitude: 0,
        m_attendance_spots_longitude: 0,
        m_attendance_spots_radius: 0,
      },
      center: {
        lat: -6.93,
        lng: 107.6,
      },
      maps: {
        ready: false,
        fallbackProcedure: "manually", //gps | geolocation | address | manually
        zoom: 17, //Default Zoom
        geolocation: {
          lat: 31.73858,
          lng: -35.98628,
          zoom: 2,
        },
        address: {
          query: "Albania, Tirane",
          zoom: 10,
        },
        manually: {
          address_description: "21 Dhjetori, Tirana, Albania",
          city: "Tirana",
          country: "Albania",
          lat: 41.3267905,
          lng: 19.8060475,
          state: "Tirana County",
          zip_code: "",
          zoom: 17,
        },
        place: {},
        form_data: {},
      },
      id: null,
      oke: false,
    };
  },
  mounted() {
    this.loadAttendanceSpot();
    // setInterval(() => {
    //   this.oke = false
    //   this.maps.ready = false
    //   this.loadAttendanceSpot();
    // }, 7000);
  },
  methods: {
    getMapData(place){
      this.attendance_spot.m_attendance_spots_address = place.address_description;
      this.attendance_spot.m_attendance_spots_latitude = place.lat;
      this.attendance_spot.m_attendance_spots_longitude = place.lng;
    },
    saveAttendanceSpot() {
      $("#submit").prop("disabled", true);
      $("#submit").html("Loading...");

      axios
        .post(env.VITE_API_URL + "attendance-spot", {
          id: this.id,
          attendance_spot: this.attendance_spot,
          radius: this.radius,
        })
        .then((response) => {
          if (Api.response(response.data) === Api.STATUS_SUCCESS) {
            this.$router.push("/attendance-spot");
          }
          $("#submit").prop("disabled", false);
          $("#submit").html("Submit");
        })
        .catch((error) => {
          $("#submit").prop("disabled", false);
        });
    },
    async loadAttendanceSpot() {
      // alert(this.maps.geolocation.lat)
      this.id = this.$route.params.id;
      this.id = this.id != null ? this.id : "";
      if (this.id != "") {
        this.$Progress.start();
        this.title = "Update";
        await axios
          .get(env.VITE_API_URL + "attendance-spot/" + this.id)
          .then((response) => {
            if (Api.response(response.data, false) === Api.STATUS_SUCCESS) {
              this.$Progress.finish();
              this.attendance_spot = response.data.data;
              this.radius = this.attendance_spot.m_attendance_spots_radius;
              this.maps.manually.lat = parseFloat(
                this.attendance_spot.m_attendance_spots_latitude
              );
              // alert(this.maps.manually.lat)
              this.maps.manually.lng = parseFloat(
                this.attendance_spot.m_attendance_spots_longitude
              );
              this.maps.manually.address_description =
                this.attendance_spot.m_attendance_spots_address;
              this.maps.ready = true
              
              setTimeout(() => {
                $("#pac-input").val(
                  this.attendance_spot.m_attendance_spots_address
                );
              }, 1000)
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