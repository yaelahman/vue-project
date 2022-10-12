import moment from 'moment';
export const MES_SUCESS = 'success'
export const MES_ERROR = 'error'
export const MES_VALIDITY = 'Input data dengan lengkap'
export const STATUS_SUCCESS = 200
export const STATUS_ERROR = 400
export const STATUS_LOGOUT = 401

export const STATUS_USER_COMPANY = ['Tidak Aktif', 'Gratis Awal', 'Gratis', 'Berbayar']
export const URL_PHOTO = import.meta.env.VITE_API_URL + "/storage/photo_absensi/"

export const SES_PREFIX = 'prefix'
export const SES_NAME = 'session_name'

let prefix = localStorage.getItem(SES_PREFIX)
let this_progress = null;

export function convertDate(date, format = 'DD-MM-YYYY', empty = '-', subtract = false) {
    if (subtract) {

        return date != null ? moment(date).subtract(7, 'h').format(format) : empty;
    }
    return date != null ? moment(date).format(format) : empty;
}

export function convertTime(date, format = 'hh:mm', empty = '-', subtract = false) {
    if (subtract) {

        return date != null ? moment(date).subtract(7, 'h').format(format) : empty;
    }
    return date != null ? moment(date).format(format) : empty;
}

export function formatRupiah(angka, prefix) {
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

export function response(data, is_dialog = true) {
    // this.finish()
    let status = data.status
    let message = data.message
    let status_message = status == STATUS_SUCCESS ? MES_SUCESS : MES_ERROR
    if (is_dialog) {
        Toast.fire({
            icon: status_message,
            title: message
        })
    }
    return status
}

export function messageSuccess(icon, message) {
    return Toast.fire({
        icon: icon,
        title: message
    })
}

export function messageError(e) {
    // this.fail()
    if (e.response != null && e.response.status === STATUS_LOGOUT) {
        localStorage.removeItem('token')
        window.location.href = window.location.origin + '/#/'
        // return location.reload()
        return Toast.fire({
            icon: MES_ERROR,
            title: "Session telah berakhir, silahkan login kembali"
        })
    }
    if (!e.status) {
        return false
        // network error
        return Toast.fire({
            icon: MES_ERROR,
            title: "Koneksi Gagal"
        })
    }
    return Toast.fire({
        icon: MES_ERROR,
        title: e
    })
}

export function dialogError(message) {
    return Swal.fire({
        icon: 'error',
        title: 'Peringatan',
        text: message
    })
}

export function isAdmin() {
    return prefix == 'admin' ? true : false
}

export function getPrefix() {
    return prefix
}

export function getSplit(data, mark, index) {
    let datas = data != null ? data.split(mark) : []
    let split = datas.length > 1 ? datas[index] : datas
    return split
}

export function copy(source) {
    // using native JSON functions removes reactivity
    // so we can clone an object without mutating the original source
    return JSON.parse(JSON.stringify(source));
}

export function copywithExcept(arr, key, except) {
    let units = [];
    if (arr != null) {
        arr.forEach(element => {
            if (element[key] != except) {
                units.push(element)
            }
        });
    }
    return units;
}
export function confirmGenerate(title, text, icon = 'warning', confirmText = 'Iya, generate!') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        reverseButtons: true
    });
}

export function confirmDelete(title, text, icon = 'warning') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iya, delete!',
        reverseButtons: true
    });
}

export function exist(arr, search) {
    return arr.indexOf(search) === -1 ? false : true
}

export function existKode(arr, key, search) {
    return arr.map(function (e) { return e[key]; }).indexOf(search) === -1 ? false : true
}

export function searchIndex(arr, key, search) {
    index = arr.findIndex(e => e[key] === search)
    return index
}

export function objectToArray(objArr, keyObj) {
    let arr = [];
    objArr.forEach(element => {
        arr.push(element[keyObj])
    });
    return arr;
}

export function arrayToObject(arr) {
    let arrObj = [];
    arr.forEach((element, index) => {
        arrObj.push({
            id: index,
            name: element
        })
    });
    return arrObj;
}

export function start(progress) {
    this_progress = progress
    this_progress.start()
}

export function finish() {
    if (this_progress != null)
        this_progress.finish()
}

export function fail() {
    if (this_progress != null)
        this_progress.fail()
}