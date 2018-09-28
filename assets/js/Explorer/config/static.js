export default {

    api: {
        url: '//api.hicube.caida.org/test',
        timeout: 1000
    },

    expression: {
        type: 'path',
        path: 'darknet.ucsd-nt.non-spoofed.overall.uniq_src_ip'
    },
    from: '-7d',
    plugin: 'xyGraph'

};
