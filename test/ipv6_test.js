var get_ip = require('..')().get_ip,
    assert = require('assert'),
    request = {'headers': {'connection': {'remoteAddress': '172.0.0.1'}}};


describe('HTTP_X_FORWARDED_FOR Multiple IPs', function() {
  it('should return best matched proxy IP address first', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

