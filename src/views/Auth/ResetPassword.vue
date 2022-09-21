<template>
    <main>
        <div class="app app-auth-sign-in align-content-stretch d-flex flex-wrap justify-content-end">
            <div class="app-auth-background">
                <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel" data-pause="true">
                    <ol class="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active" data-interval="8000">
                            <img src="http://localhost:5173/assets/images/backgrounds/default.png" class="d-block w-100" alt="..." style="height: 100vh; object-fit: cover;">
                        </div>
                    </div>
                </div>
            </div>
            <div class="app-auth-container" style="overflow: scroll;">
                <div style="margin: 5rem;">
                    <div class="border-home" style="padding-top: 8rem; padding-bottom: 8rem;">
                        <div class="logo">
                            <svg width="30" height="30" viewBox="0 0 50 50" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M37.5 16.6667H41.6667C42.2192 16.6667 42.7491 16.8862 43.1398 17.2769C43.5305 17.6676 43.75 18.1975 43.75 18.75V43.75C43.75 44.3026 43.5305 44.8325 43.1398 45.2232C42.7491 45.6139 42.2192 45.8334 41.6667 45.8334H8.33333C7.7808 45.8334 7.25089 45.6139 6.86019 45.2232C6.46949 44.8325 6.25 44.3026 6.25 43.75V18.75C6.25 18.1975 6.46949 17.6676 6.86019 17.2769C7.25089 16.8862 7.7808 16.6667 8.33333 16.6667H12.5V14.5834C12.5 11.2682 13.817 8.08874 16.1612 5.74454C18.5054 3.40033 21.6848 2.08337 25 2.08337C28.3152 2.08337 31.4946 3.40033 33.8388 5.74454C36.183 8.08874 37.5 11.2682 37.5 14.5834V16.6667ZM10.4167 20.8334V41.6667H39.5833V20.8334H10.4167ZM22.9167 29.1667H27.0833V33.3334H22.9167V29.1667ZM14.5833 29.1667H18.75V33.3334H14.5833V29.1667ZM31.25 29.1667H35.4167V33.3334H31.25V29.1667ZM33.3333 16.6667V14.5834C33.3333 12.3732 32.4554 10.2536 30.8926 8.69082C29.3298 7.12801 27.2101 6.25004 25 6.25004C22.7899 6.25004 20.6702 7.12801 19.1074 8.69082C17.5446 10.2536 16.6667 12.3732 16.6667 14.5834V16.6667H33.3333Z"
                                    fill="#9E9E9E" />
                            </svg>

                        </div>
                        <h4 class="mb-3 mt-4" style="color: #34B1E8;"><b>Input password baru</b></h4>
                        <form @submit.prevent="resetPassword">
                            <div class="">
                                <p>Silahkan input password baru anda.</p>
                                <div class="auth-credentials m-b-xxl">
                                    <label for="" class="form-label">Email</label>
                                    <input type="email" v-model="data.email" class="form-control"
                                        placeholder="email" readonly>

                                    <div class="input-icons">
                                        <label for="signInPassword" class="form-label">Password Baru</label>
                                        <input type="password"
                                            class="form-control" :class="validation.password.status ? 'is-invalid' : ''"
                                            @change="validation.password.status = false"
                                            id="signInPassword" aria-describedby="signInPassword"
                                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                            v-model="data.password" required
                                            style="padding-left: 50px; background-image: url('http://localhost:5173/assets/images/icons/lock.svg'); background-size: 15px; background-repeat: no-repeat; background-position-x: 3%; background-position-y: 50%;">
                                            <span class="invalid-feedback" v-if="validation.password.status" role="alert">
                                                <strong>{{ validation.password.message }}</strong>
                                            </span>
                                        <div
                                            style="float: right; position: relative; margin-top: -30px; margin-right: 20px;">
                                            <img src="http://localhost:5173/assets/images/icons/eye.svg" alt="" width="15px"
                                                height="auto" style="cursor: pointer" class="showPassword">
                                        </div>
                                    </div>
                                    <div class="input-icons">
                                        <label for="" class="form-label">Konfirmasi Password Baru</label>
                                        <input type="password"
                                            
                                            class="form-control" :class="validation.password_confirmation.status ? 'is-invalid' : ''"
                                            @change="validation.password_confirmation.status = false"
                                            id="signInPasswordConfirmation" aria-describedby="signInPassword"
                                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                            v-model="data.password_confirmation" required
                                            style="padding-left: 50px; background-image: url('http://localhost:5173/assets/images/icons/lock.svg'); background-size: 15px; background-repeat: no-repeat; background-position-x: 3%; background-position-y: 50%;">
                                            <span class="invalid-feedback" v-if="validation.password_confirmation.status" role="alert">
                                                <strong>{{ validation.password_confirmation.message }}</strong>
                                            </span>
                                        <div
                                            style="float: right; position: relative; margin-top: -30px; margin-right: 20px;">
                                            <img src="http://localhost:5173/assets/images/icons/eye.svg" alt="" width="15px"
                                                height="auto" style="cursor: pointer" class="showPassword">
                                        </div>
                                    </div>
                                </div>

                                <div class="auth-submit row d-flex justify-content-between">
                                    <div class=" col-lg-4 col-sm-12 ">
                                        <a href="{{ route('login') }}">Kembali</a>
                                    </div>
                                    <div class="col-lg-8 col-sm-12">
                                        <button type="submit" id="submit" class="btn btn-primary w-100"
                                            style="border-radius: 30px; ">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
    import axios from 'axios';
    import * as Api from '../../helper/Api.js'
    export default {
        data() {
            return {
                data: {
                    email: this.$route.query.email,
                    token: this.$route.params.token
                },
                validation: {
                    password: {
                        status: false,
                        message: ''
                    },
                    password_confirmation: {
                        status: false,
                        message: ''
                    },
                },
            }
        },
        methods: {
        validator(key, data) {
            this.validation[key] = data
        },
        async resetPassword() {
            $("#submit").prop("disabled", true);
            $("#submit").html("Loading...");
            await axios
                .post(env.VITE_API_URL + "reset-password", this.data)
                .then((response) => {
                    if (response.data.message) {
                        if (Api.response(response.data) === Api.STATUS_SUCCESS) {
                            this.success = true
                            this.$router.push('/login')
                        }
                    } else {
                        let err = response.data
                        for (var key in err) {
                            if (err.hasOwnProperty(key)) {
                                this.validator(key, {
                                    status: true,
                                    message: err[key][0]
                                })
                            }
                        }
                    }
                    $("#submit").prop("disabled", false);
                    $("#submit").html("Kirim Link");
                }).catch((err) => {
                    console.log(err)
                    Api.response(err.response.data)
                    $("#submit").prop("disabled", false);
                    $("#submit").html("Kirim Link");
                })
            }
        }
    }
</script>
