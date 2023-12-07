#!/usr/bin/env bash
cd || exit 1
wget https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
export jsonfile=`cat bifrost-wallet.providerlist.json`
if jq -e . >/dev/null <<<"$jsonfile"; then
  cp -f bifrost-wallet.providerlist.json /srv/tempo/wwwftsocan/public/
  chown 1000:1000 /srv/tempo/wwwftsocan/public/bifrost-wallet.providerlist.json
  rm -f bifrost-wallet.providerlist.json
else
  echo "CRON - $( date ) : Failed to update bifrost-wallet.providerlist.json." >> /srv/tempo/wwwftsocan/logs/log.txt
fi
git clone https://github.com/TowoLabs/ftso-signal-providers.git
if [[ -d ftso-signal-providers/assets ]]; then
  cp -rf ftso-signal-providers/assets/* /srv/tempo/wwwftsocan/public/assets/
  rm -rf ftso-signal-providers
  chown -R 1000:1000 /srv/tempo/wwwftsocan/public/assets
else
  echo "CRON - $( date ) : Failed to update FTSO provider assets." >> /srv/tempo/wwwftsocan/logs/log.txt
fi
