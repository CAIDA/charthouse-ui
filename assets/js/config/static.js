export default {

    baseUri: 'https://test.hicube.caida.org',

    api: {
        url: 'https://api.hicube.caida.org/test',
        timeout: 1000
    },

    expressions: [{
        type: 'path',
        path: 'darknet.ucsd-nt.non-spoofed.overall.uniq_src_ip'
    }],
    from: '-7d',
    plugin: 'xyGraph'

};
