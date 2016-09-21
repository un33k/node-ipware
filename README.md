Node IPware
====================

**A Node application to retrieve user's IP address**

[![Build Status](https://secure.travis-ci.org/un33k/node-ipware.png?branch=master)](http://travis-ci.org/un33k/node-ipware)
[![Downloads](http://img.shields.io/npm/dm/ipware.svg)](https://npmjs.org/package/ipware)


Overview
====================

**Best attempt** to get user's (client's) real ip-address while keeping it **DRY**.

How to install
====================

    1. npm install ipware
    2. git clone http://github.com/un33k/node-ipware
        a. npm install node-ipware
    3. wget https://github.com/un33k/node-ipware/zipball/master
        a. unzip the downloaded file
        b. npm install node-ipware

How to use
====================

   ```javascript
    // In your js file (e.g. app.js)
    var get_ip = require('ipware')().get_ip;
    app.use(function(req, res, next) {
        var ip_info = get_ip(req);
        console.log(ip_info);
        // { clientIp: '127.0.0.1', clientIpRoutable: false }
        next();
    });

    // `get_ip` also adds two fields to your request object
    // 1. `clientIp`, 2. `clientIpRoutable`
    // Where:
    //    `clientIp` holds the client's IP address
    //    'clientIpRoutable` is `true` if user's IP is `public`. (externally route-able)
    //                       is `false` if user's IP is `private`. (not externally route-able)

    // Advanced option: By default the left most address in the `HTTP_X_FORWARDED_FOR` or `X_FORWARDED_FOR`
    // is returned.  However, depending on your preference and needs, you can change this
    // behavior by passing the `right_most_proxy=True` to the API.
    // Note: Not all proxies are equal. So left to right or right to left preference is not a
    // rule that all proxy servers follow.

    var ip_info = get_ip(req, right_most_proxy=True)
   ```

Advanced users:
====================

   ```javascript
    // 1. Trusted Proxies:
    // *************************
    // To only get client ip addresses from your own trusted proxy server(s), use `get_trusted_ip()`.
    // In your js file (e.g. app.js)
    var get_trusted_ip = require('ipware')().get_trusted_ip;
    var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
    app.use(function(req, res, next) {
        var ip_info = get_trusted_ip(req, trusted_proxies);
        console.log(ip_info);
        // { clientIp: '177.100.44.22', clientIpRoutable: true }
        next();
    });

    // Alternatively, you can pass in the trusted proxies via the configuration file.
    {
      ...
      "IPWARE_TRUSTED_PROXY_LIST": [
        '177.144.11.100',
        '177.144.11.101'
      ],
      ...
    }

    // 2. Customizable configuration file:
    // ***********************************
    // You can also use your own config file as below.
    // for `IPWARE_HTTP_HEADER_PRECEDENCE_ORDER` items, the
    // check is done from top to bottom where the request `headers`
    // is examined for the existence of the IP address field.

    // All lists that start with `IPV` are examined and if an IP
    // address starts with any of those patterns the IP is considered
    // `private`, otherwise the IP is considered `public` which means
    // the IP is externally routable. (reachable through the Internet :)

    // Simply copy the following content into a JSON file and
    // modify it to suit your needs and place it in your project
    // under version control.

    // Then you can use it like:
    // var get_ip = require('ipware')('../path/to/your/conf.json').get_ip;

    {
      "IPWARE_HTTP_HEADER_PRECEDENCE_ORDER": [
        "HTTP_X_FORWARDED_FOR",
        "HTTP_CLIENT_IP",
        "HTTP_X_REAL_IP",
        "HTTP_X_FORWARDED",
        "HTTP_X_CLUSTER_CLIENT_IP",
        "HTTP_FORWARDED_FOR",
        "HTTP_FORWARDED",
        "HTTP_VIA",
        "X_FORWARDED_FOR",
        "REMOTE_ADDR"
      ],

      "IPWARE_HTTP_HEADER_PROXY_PRECEDENCE_ORDER": [
        "HTTP_X_FORWARDED_FOR",
        "X_FORWARDED_FOR"
      ],

      "IPWARE_TRUSTED_PROXY_LIST": [
      ],

      "IPV4_EXTERNALLY_NON_ROUTABLE_IP_PREFIX": [
        "0.",
      ],

      "IPV4_CLASS_A_PRIVATE_BLOCK_IP_PREFIX": [
        "10."
      ],

      "IPV4_LOCAL_LINK_BLOCK_IP_PREFIX": [
        "169.254."
      ],

      "IPV4_CLASS_B_PRIVATE_BLOCK_IP_PREFIX": [
        "172.16.",
        "172.17.",
        "172.18.",
        "172.19.",
        "172.20.",
        "172.21.",
        "172.22.",
        "172.23.",
        "172.24.",
        "172.25.",
        "172.26.",
        "172.27.",
        "172.28.",
        "172.29.",
        "172.30.",
        "172.31."
      ],

      "IPV4_EXAMPLE_CODE_DOCUMENTATION_IP_PREFIX": [
        "192.0.2."
      ],

      "IPV4_CLASS_C_PRIVATE_BLOCK_IP_PREFIX": [
        "192.168."
      ],

      "IPV4_BRODCAST_IP_PREFIX": [
        "255.255.255."
      ],

      "IPV4_LOOPBACK_IP_PREFIX": [
        "127."
      ],

      "IPV6_EXAMPLE_CODE_DOCUMENTATION_IP_PREFIX": [
        "2001:db8:"
      ],

      "IPV6_PRIVATE_BLOCK_IP_PREFIX": [
        "fc00:"
      ],

      "IPV6_LINK_LOCAL_UNICAST_IP_PREFIX": [
        "fe80:"
      ],

      "IPV6_MULTICAST_IP_PREFIX": [
        "ff00:"
      ],

      "IPV6_LOOPBACK_IP_PREFIX": [
        "::1"
      ]
    }


   ```

Running the tests
====================

To run the tests against the current environment:

    npm test

License
====================

Released under a ([MIT](LICENSE)) license.
