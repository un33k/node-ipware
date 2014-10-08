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

describe('HTTP_X_FORWARDED_FOR Multiple IPs with Invalid IP Address', function() {
  it('should return best matched proxy IP address while handling an invalid address', function() {
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown, 192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR Single IP Address', function() {
  it('should return best matched proxy IP address if only one provided', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.139');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR Single Private IP Address', function() {
  it('should return best matched public ip address if proxy returns a single private ip', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR Malformed IP Address FallBack on HTTP_X_REAL_IP', function() {
  it('should return the next best match IP if proxy\'s ip is malformed', function() {
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR NO IP Address FallBack on HTTP_X_REAL_IP', function() {
  it('should return the next best match IP if proxy returns no ip', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP NO IP Address FallBack on REMOTE_ADDR', function() {
  it('should return the next best match IP if proxy and x_real_ip return no ip', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR NO IP Address FallBack on HTTP_X_REAL_IP', function() {
  it('should return the next best match IP if proxy returns no ip and x_real_ip is private', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '192.168.255.182';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('HTTP_X_FORWARDED_FOR NO IP Address FallBack on HTTP_X_REAL_IP', function() {
  it('should return the next best match IP if proxy returns no ip and x_real_ip is private', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '127.0.0.1';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});








