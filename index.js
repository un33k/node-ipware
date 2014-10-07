
var ipware_defs = null;
var ipware_precedence_list = [];
var ipware_prefix_list = [];


module.exports = function (config_file) {

    if (!ipware_defs){
        var fname = config_file || __dirname + '/defaults.json';
        try {
            ipware_defs = require(fname);
        } catch(e) {
            throw e;
        }
    }

    get_precedence_list(ipware_defs);
    get_non_routable_prefix_list(ipware_defs);

    function get_precedence_list(json){
        try {
            ipware_precedence_list = json.IPWARE_HTTP_HEADER_PRECEDENCE_ORDER;
        } catch(e) {
            throw e;
        }
    }

    function get_non_routable_prefix_list(json){
        for (var prefix in json) {
            if (prefix.indexOf('IPV4') === 0 || prefix.indexOf('IPV6') === 0){
                var private_prefix = json[prefix];
                ipware_prefix_list = ipware_prefix_list.concat(private_prefix);
            }
        }
    }

    function is_private_ip(ip){
        var ip = ip.toLowerCase();
        for (var i = 0; i < ipware_prefix_list.length; i++){
            var prefix = ipware_prefix_list[i];
            if (ip.indexOf(prefix.toLowerCase()) === 0){
                return true;
            }
        }
        return false;
    }

    function is_valid_ipv4(ip){
        ipv4_pattern = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/;
        if (!ipv4_pattern.test(ip)) {
            return false;
        }
        var token = ip.split('.');
        return token[0] <= 255 && token[1] <= 255 && token[2] <= 255 && token[3] <= 255;
    }

    function is_valid_ipv6(ip){
        ipv6_pattern = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;
        return ipv6_pattern.test(ip)
    }

    function is_valid_ip(ip){
        return is_valid_ipv4(ip) || is_valid_ipv6(ip);
    }

    function getip (req, res, next) {
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
                for (var j = 0; j < ips.length; j++){
                    var ip = ips[j].trim();
                    if (ip && is_valid_ip(ip)){
                        if (is_private_ip(ip)){
                            if (!req.clientIp){
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
        if (!req.clientIp){
            req.clientIp = req.connection.remoteAddress;
        }
        next();
    };
    return getip;
};
