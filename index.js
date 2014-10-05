var ipware_defs = null;
var ipware_precedence_list = [];
var ipware_prefix_list = [];


module.exports = function (config_file) {
    var module = {};

    if (!ipware_defs){
        var fname = config_file || __dirname + 'defaults.json';
        try {
            ipware_defs = require(fname);
        catch(err) {
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
            if (prefix.indexOf('IPV4') == 0 || prefix.indexOf('IPV6') == 0){
                ipware_prefix_list.push(prefix);
            }
        }
    }

    module.ip = function (req, res) {
        req.is_ip_routable = false;
        req.clientIp = null;
        for (var i = 0; i < ipware_precedence_list.length; i++) {
            try {
                var value = req.headers[ipware_precedence_list[i].trim()];
            } catch {
                continue;
            }
            if (value){
                var ips = value.split(',');
                for (var j=0; j < ips.length; j++){
                    var ip = ips[i].toLowerCase();
                    for (var k=0; k=ipware_prefix_list.length; k++){
                        var prefix = ipware_prefix_list[k].toLowerCase();
                        if (ip.indexOf(prefix) != 0){
                            req.clientIp = ip;
                            req.is_ip_routable = true;
                            return;
                        }
                        req.clientIp = ip;
                    }
                }
            }
        }
        if (!req.clientIp){
            req.clientIp = req.connection.remoteAddress;
        }
    };

    return module;
};
