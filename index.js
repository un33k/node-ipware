var ipware_defs = null;
var ipware_precedence_list = [];
var ipware_prefix_list = [];


module.exports = function (config_file) {

    if (!ipware_defs){
        var fname = config_file || __dirname + '/defaults.json';
        try {
            ipware_defs = require(fname);
        } catch(err) {
            console.log(err);
            return {};
        }
    }

    get_precedence_list(ipware_defs);
    get_non_routable_prefix_list(ipware_defs);

    function get_precedence_list(json){
        try {
            ipware_precedence_list = json.IPWARE_HTTP_HEADER_PRECEDENCE_ORDER;
        } catch(err) {
            console.log(err);
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

    function getip (req, res, next) {
        req.clientIpRoutable = false;
        req.clientIp = null;

        for (var i = 0; i < ipware_precedence_list.length; i++) {
            try {
                var value = req.headers[ipware_precedence_list[i].trim()];
            } catch (err) {
                continue;
            }
            if (value){
                var ips = value.split(',');
                for (var j = 0; j < ips.length; j++){
                    var ip = ips[j].trim();
                    if (ip){
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
