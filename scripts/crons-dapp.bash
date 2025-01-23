#!/usr/bin/env bash
# Update provider list for delegation.
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
# Update validator list for staking.
cd || exit 1
curl https://api-flare-validators.flare.network/api/v1/validator -o validatorlist.json
export jsonfile=`cat validatorlist.json`
if jq -e . >/dev/null <<<"$jsonfile"; then
  if [[ `jq -e '.[0] | has("name")' <<<"$jsonfile"` == "true" && `jq -e '.[0] | has("nodeId")' <<<"$jsonfile"` == "true" && `jq -e '.[0] | has("lastSeen")' <<<"$jsonfile"` == "true" && `jq -e '.[0] | has("lastStatus")' <<<"$jsonfile"` == "true" && `jq -e '.[0] | has("uptime")' <<<"$jsonfile"` == "true" ]]; then
    jsonlength=`jq length <<<"$jsonfile"`

    for i in $(seq 1 $jsonlength)
    do
      if [[ `jq -e ".[$i] | has(\"name\")" <<<"$jsonfile"` == "false" ]]; then
        php -r '$collection = json_decode(file_get_contents("validatorlist.json")); foreach($collection as $index => &$object) { if (!isset($object->name)) { $object->name = "Unknown"; } } file_put_contents("validatorlist.json", json_encode($collection, JSON_PRETTY_PRINT));'
      fi
    done

    cp -f validatorlist.json /srv/tempo/wwwftsocan/public/
    cp -f validatorlist.json /srv/tempo/wwwftsocan/data/
    chown 1000:1000 /srv/tempo/wwwftsocan/public/validatorlist.json
    chown 1000:1000 /srv/tempo/wwwftsocan/data/validatorlist.json
    rm -f validatorlist.json
  else
    cp -f /srv/tempo/wwwftsocan/data/validatorlist.json /srv/tempo/wwwftsocan/public/
  fi
else
  echo "CRON - $( date ) : Failed to update validatorlist.json." >> /srv/tempo/wwwftsocan/logs/log.txt
fi
# Update reward distribution data tuples.
cd /srv/tempo/wwwftsocan/scripts || exit 1
./json-cleaner.bash