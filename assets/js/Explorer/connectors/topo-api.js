import config from 'Config';
import { auth } from 'Auth';

class TopoApi {

    constructor() {
        var apiCfg = config.getParam('api');
        this.apiUrl = apiCfg.url;
    }

    getTopoJsonUrl(table, db) {
        return `${this.apiUrl}/topo/databases/${db}/tables/${table}`;
    }
}

export default TopoApi;
