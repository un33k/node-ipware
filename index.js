
var is_initialized = false;
var ipware_defs = null;
var ipware_precedence_list = [];
var ipware_prefix_list = [];


module.exports = function (config_file) {
    var _me = {};
    var _conf = config_file || __dirname + '/defaults.json';

    function get_precedence_list() {
        try {
            ipware_precedence_list = ipware_defs.IPWARE_HTTP_HEADER_PRECEDENCE_ORDER;
        } catch(e) {
            throw e;
        }
    }

    function get_non_routable_prefix_list() {
        for (var prefix in ipware_defs) {
            if (prefix.indexOf('IPV4') === 0 || prefix.indexOf('IPV6') === 0){
                var private_prefix = ipware_defs[prefix];
                ipware_prefix_list = ipware_prefix_list.concat(private_prefix);
            }
        }
        if (ipware_prefix_list.length === 0) {
            throw "No private IP prefix found in " + _conf;
        }
    }

    function get_config_file() {
        try {
            ipware_defs = require(_conf);
        } catch(e) {
            throw e;
        }
    }

    function initialize() {
            if (!is_initialized){
            get_config_file();
            get_precedence_list();
            get_non_routable_prefix_list();
        }
    }

    initialize();

    _me.is_private_ip = function (ip) {
        var ip = ip.toLowerCase();
        for (var i = 0; i < ipware_prefix_list.length; i++) {
            var prefix = ipware_prefix_list[i];
            if (ip.indexOf(prefix.toLowerCase()) === 0) {
                return true;
            }
        }
        return false;
    }

    _me.is_valid_ipv4 = function (ip) {
        ipv4_pattern = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/;
        if (!ipv4_pattern.test(ip)) {
            return false;
        }
        var token = ip.split('.');
        return token[0] <= 255 && token[1] <= 255 && token[2] <= 255 && token[3] <= 255;
    }

    _me.is_valid_ipv6 = function (ip) {
        ipv6_pattern = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;
        return ipv6_pattern.test(ip)
    }

    _me.is_valid_ip = function (ip) {
        return _me.is_valid_ipv4(ip) || _me.is_valid_ipv6(ip);
    }

    _me.get_ip = function (req) {
        req.clientIpRoutable = false;
        req.clientIp = null;

        for (var i = 0; i < ipware_precedence_list.length; i++) {
            try {
                var value = req.headers[ipware_precedence_list[i].trim()];
            } catch (e) {
                continue;
            }
            if (value){
                var ips = value.split(',');
                for (var j = 0; j < ips.length; j++) {
                    var ip = ips[j].trim();
                    if (ip && _me.is_valid_ip(ip)) {
                        if (_me.is_private_ip(ip)) {
                            if (!req.clientIp) {
                                req.clientIp = ip;
                            }
                        } else {
                            req.clientIp = ip;
                            req.clientIpRoutable = true;
                            return;
                        }
                    }
                }
            }
        }
        if (!req.clientIp) {
            req.clientIp = req.connection.remoteAddress;
        }
    };

    return _me;
};
