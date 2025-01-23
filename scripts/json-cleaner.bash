#!/usr/bin/env bash
cd ../public || exit 1

if [[ -d fsp-rewards ]]; then
  cd fsp-rewards || exit 1
  git fetch --tags --all
  git pull origin main

  if [[ $? != 0 ]]; then
    cd ..
    rm -rf fsp-rewards
    git clone https://github.com/flare-foundation/fsp-rewards.git
  else
    cd ..
  fi
else
  git clone https://github.com/flare-foundation/fsp-rewards.git
fi

cd fsp-rewards/flare || exit 1
for d in */ ; do
  [ -L "${d%/}" ] && continue
  cd "$d" || exit 1
  php -r '$object = json_decode(file_get_contents("reward-distribution-data-tuples.json")); foreach($object->rewardClaims as &$rewardClaim) { $rewardClaim[1][3] = (string) $rewardClaim[1][3]; } file_put_contents("reward-distribution-data-tuples.json", json_encode($object));'
  cd ..
done

cd ../songbird || exit 1
for d in */ ; do
  [ -L "${d%/}" ] && continue
  cd "$d" || exit 1
  php -r '$object = json_decode(file_get_contents("reward-distribution-data-tuples.json")); foreach($object->rewardClaims as &$rewardClaim) { $rewardClaim[1][3] = (string) $rewardClaim[1][3]; } file_put_contents("reward-distribution-data-tuples.json", json_encode($object));'
  cd ..
done
