var is_initialized = false;
var ipware_defs = null;
var ipware_precedence_list = [];
var ipware_proxy_precedence_list = [];
var ipware_proxy_list = [];
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

    function get_proxy_precedence_list() {
        try {
            ipware_proxy_precedence_list = ipware_defs.IPWARE_HTTP_HEADER_PROXY_PRECEDENCE_ORDER;
        } catch(e) {
            throw e;
        }
    }

    function get_proxy_list() {
        try {
            ipware_proxy_list = ipware_defs.IPWARE_TRUSTED_PROXY_LIST;
        } catch(e) {
            throw e;
        }
    }

    function get_non_routable_prefix_list() {
        for (var prefix in ipware_defs) {
            if (prefix.indexOf('IPV4') === 0 || prefix.indexOf('IPV6') === 0) {
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
        if (!is_initialized) {
            get_config_file();
            get_precedence_list();
            get_proxy_precedence_list();
            get_proxy_list();
            get_non_routable_prefix_list();
            is_initialized = true;
        }
    }

    _me.cleanup_ip = function (ip) {
        var ip = ip.trim();
        if (ip.toLowerCase().startsWith('::ffff:')) {
            return ip.substring('::ffff:'.length)
        }
        return ip;
    }

    _me.is_loopback_ip = function (ip) {
        var ip = ip.toLowerCase().trim();
        return ip === '127.0.0.1' || ip === '::1';
    }

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
        var ipv4_pattern = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/;
        if (!ipv4_pattern.test(ip)) {
            return false;
        }
        var token = ip.split('.');
        return token[0] <= 255 && token[1] <= 255 && token[2] <= 255 && token[3] <= 255;
    }

    _me.is_valid_ipv6 = function (ip) {
        var ipv6_pattern = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;
        return ipv6_pattern.test(ip)
    }

    _me.is_valid_ip = function (ip) {
        return _me.is_valid_ipv4(ip) || _me.is_valid_ipv6(ip);
    }

    _me.get_headers_attribute = function (headers, key) {
        var key_upper = key.toUpperCase();
        if (key_upper in headers) {
            return headers[key_upper];
        }

        var key_lower = key.toLowerCase();
        if (key_lower in headers) {
            return headers[key_lower];
        }

        var alt_key_lower = key_lower.replace(/_/g, '-');
        if (alt_key_lower in headers) {
            return headers[alt_key_lower];
        }

        var alt_key_upper = alt_key_lower.toUpperCase()
        if (alt_key_upper in headers) {
            return headers[alt_key_upper];
        }

        return null;
    }

    _me.get_local_ip = function (req) {
        var ip = '127.0.0.1';
        try {
            ip = req.connection.remoteAddress;
        } catch (e) {
            try {
                ip = req.socket.remoteAddress;
            } catch (e) {
                try {
                    ip = req.connection.socket.remoteAddress;
                } catch (e) {
                    ip = '127.0.0.1';
                }
            }
        }
        return ip || '127.0.0.1';
    }

    _me.get_ip = function (req, right_most_proxy) {

        initialize();
        req.clientIpRoutable = false;
        req.clientIp = null;
        var value = null;
        var right_most_proxy = right_most_proxy || false;

        for (var i = 0; i < ipware_precedence_list.length; i++) {
            value = _me.get_headers_attribute(req.headers, ipware_precedence_list[i].trim());
            if (value) {
                var ips = value.split(',');
                if (right_most_proxy) {
                    ips = ips.reverse();
                }
                for (var j = 0; j < ips.length; j++) {
                    var ip = _me.cleanup_ip(ips[j]);
                    if (ip && _me.is_valid_ip(ip)) {
                        if (_me.is_private_ip(ip)) {
                            if (!req.clientIp || (!_me.is_loopback_ip(ip) &&
                                _me.is_loopback_ip(req.clientIp))) {
                                req.clientIp = ip;
                            }
                        } else {
                            req.clientIp = ip;
                            req.clientIpRoutable = true;
                            return {clientIp: req.clientIp, clientIpRoutable: req.clientIpRoutable}
                        }
                    }
                }
            }
        }
        if (!req.clientIp) {
            req.clientIp = _me.get_local_ip(req);
            req.clientIpRoutable = !_me.is_private_ip(req.clientIp);
        }

        return {clientIp: req.clientIp, clientIpRoutable: req.clientIpRoutable}
    };

    _me.get_trusted_ip = function (req, trusted_proxies, right_most_proxy) {
        initialize();
        var trusted_proxies = trusted_proxies || ipware_proxy_list;
        var right_most_proxy = right_most_proxy || false;
        req.clientIpRoutable = false;
        req.clientIp = null;
        var value = null;

        if (trusted_proxies.length >= 1) {
            for (var i = 0; i < ipware_proxy_precedence_list.length; i++) {
                value = _me.get_headers_attribute(req.headers, ipware_proxy_precedence_list[i].trim());
                if (value) {
                    var ips = value.split(',');
                    if (ips.length > 1 && right_most_proxy) {
                        ips = ips.reverse();
                    }
                    if (ips.length > 1) {
                        for (var j = 0; j < trusted_proxies.length; j++) {
                            if (trusted_proxies[j] === ips[ips.length-1].trim()) {
                                var ip = _me.cleanup_ip(ips[0]);
                                if (ip && _me.is_valid_ip(ip)) {
                                    req.clientIp = ip;
                                    req.clientIpRoutable = !_me.is_private_ip(ip);
                                    return {clientIp: req.clientIp, clientIpRoutable: req.clientIpRoutable}
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!req.clientIp) {
            req.clientIp = _me.get_local_ip(req);
            req.clientIpRoutable = !_me.is_private_ip(req.clientIp);
        }

        return {clientIp: req.clientIp, clientIpRoutable: req.clientIpRoutable}
    };

    return _me;
};
