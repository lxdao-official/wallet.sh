```bash
 __      __            ___    ___           __                __
/\ \  __/\ \          /\_ \  /\_ \         /\ \__            /\ \
\ \ \/\ \ \ \     __  \//\ \ \//\ \      __\ \ ,_\       ____\ \ \___
 \ \ \ \ \ \ \  /'__`\  \ \ \  \ \ \   /'__`\ \ \/      /',__\\ \  _ `\
  \ \ \_/ \_\ \/\ \L\.\_ \_\ \_ \_\ \_/\  __/\ \ \_  __/\__, `\\ \ \ \ \
   \ `\___x___/\ \__/.\_\/\____\/\____\ \____\\ \__\/\_\/\____/ \ \_\ \_\
    '\/__//__/  \/__/\/_/\/____/\/____/\/____/ \/__/\/_/\/___/   \/_/\/_/
```

# Introduction

this is a wallet manager script for terminal.

include the following features:

wallet manage:

- create wallet
- import wallet
- export wallet
- list wallet

wallet operation:

- connect to dapps via walletconnect (v1 and v2)
- sign personal_sign message
- sign eth_sign message
- sign transaction
- send transaction

chain manage:

- change active chain

# Usage

```bash

npm install

npm run start

```

# Example

```bash
 __      __            ___    ___           __                __
/\ \  __/\ \          /\_ \  /\_ \         /\ \__            /\ \
\ \ \/\ \ \ \     __  \//\ \ \//\ \      __\ \ ,_\       ____\ \ \___
 \ \ \ \ \ \ \  /'__`\  \ \ \  \ \ \   /'__`\ \ \/      /',__\\ \  _ `\
  \ \ \_/ \_\ \/\ \L\.\_ \_\ \_ \_\ \_/\  __/\ \ \_  __/\__, `\\ \ \ \ \
   \ `\___x___/\ \__/.\_\/\____\/\____\ \____\\ \__\/\_\/\____/ \ \_\ \_\
    '\/__//__/  \/__/\/_/\/____/\/____/\/____/ \/__/\/_/\/___/   \/_/\/_/


? Input password to unlock your wallet: [hidden]
? What do you want to do?
  active wallet: 0x3a73ebb7c4ec0aee2295572214b2c005b732870c (choose to change)
  active chain: mainnet (choose to change)
  create new wallet
  connect to WalletConnect
❯ connect to WalletConnect(v1)
  wallet list (4)
  answers:  connect to WalletConnect(v1)
  initing...
? paste walletconnect session:xxxx
  connecting...
? waiting for response, continue? (Y/n)

```

# TODO

- [ ] connect to multi client at the same time, and watch them all.
- [ ] provide api to other program for automatical wallet operation.
