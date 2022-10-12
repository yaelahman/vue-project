import * as Api from '../helper/Api.js'
import moment from 'moment';
export default {
    data() {
        return {}
    },
    methods: {
        async callApi(method, url, data, params = null) {
            try {
                return await axios({
                    method: method,
                    url: url,
                    data: data,
                    params: params
                });
            } catch (e) {
                Api.messageError(e)
            }
        },
        convertDate(date, format = 'DD-MM-YYYY', empty = '-') {
            return date != null ? moment(date).subtract(7, 'h').format(format) : empty;
        },
        $can(permissionName) {
            let Permission = this.$store.state.my_permissions
            // console.log(permissionName)
            // console.log(Permission)
            if (typeof Permission != 'undefined') {
                return Permission.indexOf(permissionName) !== -1;
            }
        },
    }
}