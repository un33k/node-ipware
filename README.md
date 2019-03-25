Node IPware
====================

**A Node application to retrieve user's IP address**

[![status-image]][status-link]
[![version-image]][version-link]
[![download-image]][download-link]

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
        "0."
      ],

      "IPV4_CLASS_A_PRIVATE_BLOCK_IP_PREFIX": [
        "10."
      ],

      "IPV4_CARRIER_GRADE_NAT_IP_PREFIX": [
        "100.64.",
        "100.65.",
        "100.66.",
        "100.67.",
        "100.68.",
        "100.69.",
        "100.70.",
        "100.71.",
        "100.72.",
        "100.73.",
        "100.74.",
        "100.75.",
        "100.76.",
        "100.77.",
        "100.78.",
        "100.79.",
        "100.80.",
        "100.81.",
        "100.82.",
        "100.83.",
        "100.84.",
        "100.85.",
        "100.86.",
        "100.87.",
        "100.88.",
        "100.89.",
        "100.90.",
        "100.91.",
        "100.92.",
        "100.93.",
        "100.94.",
        "100.95.",
        "100.96.",
        "100.97.",
        "100.98.",
        "100.99.",
        "100.100.",
        "100.101.",
        "100.102.",
        "100.103.",
        "100.104.",
        "100.105.",
        "100.106.",
        "100.107.",
        "100.108.",
        "100.109.",
        "100.110.",
        "100.111.",
        "100.112.",
        "100.113.",
        "100.114.",
        "100.115.",
        "100.116.",
        "100.117.",
        "100.118.",
        "100.119.",
        "100.120.",
        "100.121.",
        "100.122.",
        "100.123.",
        "100.124.",
        "100.125.",
        "100.126.",
        "100.127."
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

      "IPV4_INAA_SPECIAL_ADDRESS_REGISTRY_IP_PREFIX": [
        "192.0.0."
      ],

      "IPV4_DOCUMENTATION_AND_EXAMPLE_CODE_192_IP_PREFIX": [
        "192.0.2."
      ],

      "IPV4_CLASS_C_PRIVATE_BLOCK_IP_PREFIX": [
        "192.168."
      ],

      "IPV4_INNER_NETWORK_COMMUNICATION_BETWEEN_TWO_SEPARATE_SUBNETS_IP_PREFIX": [
        "198.18.",
        "198.19."
      ],

      "IPV4_DOCUMENTATION_AND_EXAMPLE_CODE_198_IP_PREFIX": [
        "198.51.100."
      ],

      "IPV4_DOCUMENTATION_AND_EXAMPLE_CODE_203_IP_PREFIX": [
        "203.0.113."
      ],

      "IPV4_MULTICAST_IP_PREFIX": [
        "224.",
        "225.",
        "226.",
        "227.",
        "228.",
        "229.",
        "230.",
        "231.",
        "232.",
        "233.",
        "234.",
        "235.",
        "236.",
        "237.",
        "238.",
        "239."
      ],

      "IPV4_RESERVED_IP_PREFIX": [
        "240.",
        "241.",
        "242.",
        "243.",
        "244.",
        "245.",
        "246.",
        "247.",
        "248.",
        "249.",
        "250.",
        "251.",
        "252.",
        "253.",
        "254."
      ],
      
      "IPV4_BRODCAST_IP_PREFIX": [
        "255."
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

    npm install
    npm test

License
====================

Released under a ([MIT](LICENSE)) license.

Version
====================
X.Y.Z Version

    `MAJOR` version -- when you make incompatible API changes,
    `MINOR` version -- when you add functionality in a backwards-compatible manner, and
    `PATCH` version -- when you make backwards-compatible bug fixes.

Sponsors
====================

[![Surge](https://www.surgeforward.com/wp-content/themes/understrap-master/images/logo.png)](https://github.com/surgeforward)

[status-image]: https://secure.travis-ci.org/un33k/node-ipware.png?branch=master
[status-link]: http://travis-ci.org/un33k/node-ipware?branch=master
[version-image]: https://img.shields.io/npm/v/ipware.svg
[version-link]: https://www.npmjs.com/package/ipware
[coverage-image]: https://coveralls.io/repos/un33k/node-ipware/badge.svg
[coverage-link]: https://coveralls.io/r/un33k/node-ipware
[download-image]: https://img.shields.io/npm/dm/ipware.svg
[download-link]: https://www.npmjs.com/package/ipware