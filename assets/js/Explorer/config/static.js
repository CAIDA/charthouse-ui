export default {

    api: {
        url: 'https://api.hicube.caida.org/test',
        timeout: 1000
    },

    expression: 'darknet.ucsd-nt.non-spoofed.overall.uniq_src_ip', // null
    from: '-7d',
    plugin: 'xyGraph'

};
