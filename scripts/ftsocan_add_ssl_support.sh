#!/usr/bin/env bash
if [[ -n "$1" ]]; then
  export FTSOCAN_SERVER_NAME="$1"
  # echo "ServerName $FTSOCAN_SERVER_NAME" >> /etc/httpd/httpd.conf
else
  export FTSOCAN_SERVER_NAME="localhost:8181"
  # echo "ServerName localhost" >> /etc/httpd/httpd.conf
fi
cd /etc/httpd || exit 1
cat >> ./ftsocan_localhost.conf << EOF
[req]
default_bits       = 4096
default_keyfile    = localhost.key
distinguished_name = req_distinguished_name
req_extensions     = req_ext
x509_extensions    = v3_ca

[req_distinguished_name]
countryName                 = Country Name (2 letter code)
countryName_default         = CA
stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = Quebec
localityName                = Locality Name (eg, city)
localityName_default        = Montreal
organizationName            = Organization Name (eg, company)
organizationName_default    = FTSOCAN
organizationalUnitName      = organizationalunit
organizationalUnitName_default = Dev
commonName                  = Common Name (e.g. server FQDN or YOUR name)
commonName_default          = $FTSOCAN_SERVER_NAME
commonName_max              = 64

[req_ext]
subjectAltName = @alt_names

[v3_ca]
subjectAltName = @alt_names

[alt_names]
DNS.1   = localhost
DNS.2   = 127.0.0.1
EOF
openssl req -x509 -nodes -subj "/C=CA/ST=Quebec/L=Montreal/O=FTSOCAN/CN=$FTSOCAN_SERVER_NAME" -days 365 -newkey rsa:4096 -keyout server.key -out server.crt -config ftsocan_localhost.conf
sed -i 's|#LoadModule socache_shmcb_module /usr/lib/httpd/modules/mod_socache_shmcb.so|LoadModule socache_shmcb_module /usr/lib/httpd/modules/mod_socache_shmcb.so|g' /etc/httpd/httpd.conf
sed -i 's|#LoadModule ssl_module /usr/lib/httpd/modules/mod_ssl.so|LoadModule ssl_module /usr/lib/httpd/modules/mod_ssl.so|g' /etc/httpd/httpd.conf
sed -i 's|#Include /etc/httpd/extra/httpd-ssl.conf|Include /etc/httpd/extra/httpd-ssl.conf|g' /etc/httpd/httpd.conf
/etc/init.d/httpd stop
