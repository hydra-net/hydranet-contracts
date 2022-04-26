# Ω Olympus Smart Contracts

![image](https://img.shields.io/github/forks/OlympusDAO/olympus-contracts?style=social)

This is the main Olympus smart contract development repository.

## 🔧 Setting up local development

### Requirements

-   [node v14](https://nodejs.org/download/release/latest-v14.x/)
-   [git](https://git-scm.com/downloads)

### Local Setup Steps

```sh
# Clone the repository
git clone https://github.com/OlympusDAO/olympus-contracts.git

# Install dependencies
yarn install

# Set up environment variables (keys)
cp .env.example .env # (linux)
copy .env.example .env # (windows)

# compile solidity, the below will automatically also run yarn typechain
yarn compile

# if you want to explicitly run typechain, run
yarn compile --no-typechain
yarn typechain

# run a local hardhat node
yarn run start

# test deployment or deploy
# yarn run deploy:<network>, example:
yarn run deploy:hardhat
```

### Local Setup Steps (with Docker)

A Docker image is available to simplify setup.

```sh
# First setup keys, to do this first copy as above
cp .env.example .env # (linux)
copy .env.example .env # (windows)

# Populate ALCHEMY_API_KEY and PRIVATE_KEY into `.env` afterwards
# Then, start the node
make run
```

## 📜 Contract Addresses

-   For [Ethereum Mainnet](./docs/deployments/ethereum.md).
-   For [Rinkeby Testnet](./docs/deployments/rinkeby.md).

### Notes for `localhost`

-   The `deployments/localhost` directory is included in the git repository,
    so that the contract addresses remain constant. Otherwise, the frontend's
    `constants.ts` file would need to be updated.
-   Avoid committing changes to the `deployments/localhost` files (unless you
    are sure), as this will alter the state of the hardhat node when deployed
    in tests.

## 📖 Guides

### Contracts

-   [Allocator version 1 guide (1.0.0)](./docs/guides/allocator_v1_guide.md).
-   [System Architecture (image)](./docs/guides/system_architecture.md)

### Testing

-   [Hardhat testing guide](./docs/guides/hardhat_testing.md)
-   [Dapptools testing guide](./docs/guides/dapptools.md)

### Vesting contract

This contract has possibilities to create linear of locked vestings.

Methods:

Read methods:
https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#readContract

1. `1. computeNextVestingScheduleIdForHolder` - this method is used for computing next vesting schedule id for holder, param `holder (address)` is address that receives vestings
2. `2. computeReleasableAmount ` - this method is used to compute releasable amount based on vesting schedule id `vestingScheduleId (bytes32)`
3. `3. computeVestingScheduleIdForAddressAndIndex ` - this method is use for computing vesting id based on `holder (address)` and `index (uint256)` of vesting
4. `4. getLastVestingScheduleForHolder ` - this method is used for getting last vesting schedule for holder
5. `5. getToken ` - shows token that's vesting
6. `6. getVestingIdAtIndex ` - get vesting Id at index
7. `7. getVestingSchedule ` - use this one if you want to get vesting schedule array, add `vestingScheduleId (bytes32)` compted with previous methods
8. `8. getVestingScheduleByAddressAndIndex ` - use this one to get vesting schedule by address and index
9. `9. getVestingSchedulesCount ` - this method shows how much vesting schedules are there, revoked ones are also counted as they are not deleated, they are just disabled
10. `10. getVestingSchedulesCountByBeneficiary ` - you can get vesting schedules count by wallet address
11. `11. getVestingSchedulesTotalAmount ` - shows total amount of vesting tokens in contract
12. `12. getWithdrawableAmount ` - shows witdrawable amount by owner of contract, so only tokens that are not in vesting
13. `13. owner ` - shows owner of contract

Write methods:
https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#writeContract

1. `1. createVestingSchedule` - use this method to create vesting schedule
2. `2. release` - use this method to claim tokens, only `owner` or `_beneficiary (address)` can trigger this method and tokens are sent to `_beneficiary (address)`
3. `3. renounceOwnership` - use this method with caution. This method updates ownership to `0x` address, nobody controls that address so that means contract is without owner and can't revoke methods or create new schedules
4. `4. revoke` - this method is used for revoking vesting schedule
5. `5. transferOwnership` - this method is used to transfer ownership to other owner
6. `6. withdraw` - this method is used to witdraw unvested tokens from contract by owner

Guides:

1. How to create vesting?

Prerequisites:

-   vesting tokens are sent to vesting contract
-   go to https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#writeContract and connect wallet
-   to create vesting use `1. createVestingSchedule` method
-   Fields:

    -   `_beneficiary (address)` - this is address of wallet that receives vesting
    -   `_start (uint256)` - this is timestamp when vesting starts, you can get it on https://www.unixtimestamp.com/, just copy current one that showes current time
    -   `_cliff (uint256)` - this field is in seconds, it can be `0` if you want that vesting starts immediately or you can add cliff. Eg `182.625 days` or `6 months` has `15778800` seconds,
        you can convert days to seconds here https://www.unitconverters.net/time/seconds-to-days.htm and add that value to field
    -   `_duration (uint256)` - this fields is also in seconds, use https://www.unitconverters.net/time/seconds-to-days.htm to add value, so for `6 months` use `15778800` seconds
    -   `_slicePeriodSeconds (uint256)` - for linear vesting use here `1` or for cliff add `15778800` if you want it releases immediately after cliff ends
    -   `_revocable (bool)` - if this is `true` vesting can be rovoked, sometimes happens that somebody loses keys of his wallet so I strongly suggest that this is used as `true`.
        If you don't want to use it use `false`
    -   `_amount` - if token has `18` digits than for `400k` vesting tokens tokens you'll have to use `400000000000000000000000`, for `1.2M` you'll have to use `12000000000000000000000000`

    Examples:
    Linear vesting:

    1.  - `_beneficiary (address)` - 0x0000000000000000000000000000000000000000
        - `_start (uint256)` - 1650963188
        - `_cliff (uint256)` - 0
        - `_duration (uint256)` - 15778800
        - `_slicePeriodSeconds (uint256)` - 1
        - `_revocable (bool)` - true
        - `_amount` - 400000000000000000000000

    2. Lockup:


        - `_beneficiary (address)` - 0x0000000000000000000000000000000000000000
        - `_start (uint256)` - 1650963188
        - `_cliff (uint256)` - 15778800
        - `_duration (uint256)` - 15778800
        - `_slicePeriodSeconds (uint256)` - 15778800
        - `_revocable (bool)` - true
        - `_amount` - 400000000000000000000000

2. How to claim vesting?

Go to: https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#readContract

1. use `3. computeVestingScheduleIdForAddressAndIndex` method
    - `holder (address)` - is field of wallet that receives token
    - `index (uint256)` - is index of vesting, so if one wallet has only 1 vesting or lockup this is always `0`, if it has more vestings than for each vesting schedule change index.
      So if it has 2 vestings or lockups and you want to calculate id for 2nd use `1` index. Numbering starts from `0` not from `1`
    - when you press Query you'll get vestingId, copy that
2. use `2. computeReleasableAmount` method
    - `vestingScheduleId (bytes32)` - populate this field with `vestingId` you've got from `3. computeVestingScheduleIdForAddressAndIndex` method
    - press query
    - copy that amount
3. go to https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#writeContract
    - use `2. release` method
    - `vestingScheduleId (bytes32)` - add here `vestingId` you've got from 1) point
    - `amount (uint256)` - add here `amount` from 2) point

3) How to revoke vesting?

Caution:

-   when you revoke schedule all tokens that are vested till that moment will be sent to wallet that receives vesting
-   other tokens remain in token contract

1. use `3. computeVestingScheduleIdForAddressAndIndex` method
    - `holder (address)` - is field of wallet that receives token
    - `index (uint256)` - is index of vesting, so if one wallet has only 1 vesting or lockup this is always `0`, if it has more vestings than for each vesting schedule change index.
      So if it has 2 vestings or lockups and you want to calculate id for 2nd use `1` index. Numbering starts from `0` not from `1`
    - when you press Query you'll get vestingId, copy that
2. use `4. revoke` method:

-   `vestingScheduleId (bytes32)` - populate `vestingId` from 1) point

4. How to withdraw tokens from vesting contract?

-   only tokens that are not in some vesting schedule can be withdrawn
-

1. go to https://arbiscan.io/address/0xf7C14bc7dD8dd1eD95Be525A4282E7fb3313f39D#readContract
    - check `12. getWitdrawableAmount` method
    - it should show how much tokens are withdrawable, copy that number
2. use `6. withdraw` method
    - paste here amount you've got from 1) point
    - press write

5) How to transfer ownership to other owner?
    - use `5. transferOwnership` method
    - `newOwner (address)` - add new owner address to this field
    - click to write method to change ownership
