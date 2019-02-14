import BN from "bn.js";

import {GENESIS_EPOCH, GENESIS_FORK_VERSION, GENESIS_SLOT, GENESIS_START_SHARD, LATEST_BLOCK_ROOTS_LENGTH,
  LATEST_INDEX_ROOTS_LENGTH, LATEST_PENALIZED_EXIT_LENGTH, LATEST_RANDAO_MIXES_LENGTH, SHARD_COUNT, ZERO_HASH} from "../../constants";
import {BeaconState, Crosslink, Eth1Data, Fork, PendingAttestation, uint64, Validator} from "../../types";
import {bytes32, Eth1DataVote} from "../../types";
import {randBetween, randBetweenBN} from "./misc";
import {generateValidators} from "./validator";

/**
 * Copy of BeaconState, but all fields are marked optional to allow for swapping out variables as needed.
 */
interface TestBeaconState {
  // Misc
  slot?: uint64;
  genesisTime?: uint64;
  fork?: Fork; // For versioning hard forks

  // Validator registry
  validatorRegistry?: Validator[];
  validatorBalances?: uint64[];
  validatorRegistryUpdateEpoch?: uint64;

  // Randomness and committees
  latestRandaoMixes?: bytes32[];
  previousEpochStartShard?: uint64;
  currentEpochStartShard?: uint64;
  previousCalculationEpoch?: uint64;
  currentCalculationEpoch?: uint64;
  previousEpochSeed?: bytes32;
  currentEpochSeed?: bytes32;

  // Finality
  previousJustifiedEpoch?: uint64;
  justifiedEpoch?: uint64;
  justificationBitfield?: uint64;
  finalizedEpoch?: uint64;

  // Recent state
  latestCrosslinks?: Crosslink[];
  latestBlockRoots?: bytes32[];
  latestIndexRoots?: bytes32[];
  latestPenalizedBalances?: uint64[]; // Balances penalized at every withdrawal period
  latestAttestations?: PendingAttestation[];
  batchedBlockRoots?: bytes32[];

  // Ethereum 1.0 deposit root
  latestEth1Data?: Eth1Data;
  eth1DataVotes?: Eth1DataVote[];
}

/**
 * Generate beaconState, by default it will use the initial state defined when the `ChainStart` log is emitted.
 * NOTE: All fields can be overridden through `opts`.
 * @param {TestBeaconState} opts
 * @returns {BeaconState}
 */
export function generateState(opts?: TestBeaconState): BeaconState {
  const initialCrosslinkRecord: Crosslink = {
    epoch: GENESIS_EPOCH,
    shardBlockRoot: ZERO_HASH,
  };

  return {
    // MISC
    slot: GENESIS_SLOT,
    genesisTime: new BN(new Date().getTime()),
    fork: {
      previousVersion: GENESIS_FORK_VERSION,
      currentVersion: GENESIS_FORK_VERSION,
      epoch: GENESIS_EPOCH,
    },
    // Validator registry
    validatorRegistry: [],
    validatorBalances: [],
    validatorRegistryUpdateEpoch: GENESIS_EPOCH,

    // Randomness and committees
    latestRandaoMixes: Array.from({length: LATEST_RANDAO_MIXES_LENGTH}, () => ZERO_HASH),
    previousEpochStartShard: GENESIS_START_SHARD,
    currentEpochStartShard: GENESIS_START_SHARD,
    previousCalculationEpoch: GENESIS_EPOCH,
    currentCalculationEpoch: GENESIS_EPOCH,
    previousEpochSeed: ZERO_HASH,
    currentEpochSeed: ZERO_HASH,

    // Finality
    previousJustifiedEpoch: GENESIS_EPOCH,
    justifiedEpoch: GENESIS_EPOCH,
    justificationBitfield: new BN(0),
    finalizedEpoch: GENESIS_EPOCH,

    // Recent state
    latestCrosslinks: Array.from({length: SHARD_COUNT}, () => initialCrosslinkRecord),
    latestBlockRoots: Array.from({length: LATEST_BLOCK_ROOTS_LENGTH}, () => ZERO_HASH),
    latestIndexRoots: Array.from({length: LATEST_INDEX_ROOTS_LENGTH}, () => ZERO_HASH),
    latestPenalizedBalances: Array.from({length: LATEST_PENALIZED_EXIT_LENGTH}, () => new BN(0)),
    latestAttestations: [],
    batchedBlockRoots: [],

    // PoW receipt root
    latestEth1Data: {
      depositRoot: new Uint8Array(32),
      blockHash: new Uint8Array(32),
    },
    eth1DataVotes: [],
    ...opts,
  };
}

/**
 * Generates a random beacon state, with the option to override on or more parameters.
 * TODO: Should check to make sure that if a field is changed the appropriate conditions are met, BeaconState should be valid.
 * @param {TestBeaconState} opts
 * @returns {BeaconState}
 */
export function generateRandomState(opts?: TestBeaconState): BeaconState {
  const initialCrosslinkRecord: Crosslink = {
    epoch: randBetweenBN(0, 1000),
    shardBlockRoot: new Uint8Array(),
  };

  const validatorNum: number = randBetween(0, 1000);

  return {
    // MISC
    slot: randBetweenBN(0, 1000),
    genesisTime: new BN(new Date().getTime()),
    fork: {
      previousVersion: randBetweenBN(0, 1000),
      currentVersion: randBetweenBN(0, 1000),
      epoch: randBetweenBN(0, 1000),
    },
    // Validator registry
    validatorRegistry: generateValidators(validatorNum),
    validatorBalances: Array.from({length: validatorNum}, () => randBetweenBN(0, 1000)),
    validatorRegistryUpdateEpoch: randBetweenBN(0, 1000),

    // Randomness and committees
    latestRandaoMixes: Array.from({length: randBetween(0, 1000)}, () => new Uint8Array(32)),
    previousEpochStartShard: randBetweenBN(0, 1000),
    currentEpochStartShard: randBetweenBN(0, 1000),
    previousCalculationEpoch: randBetweenBN(0, 1000),
    currentCalculationEpoch: randBetweenBN(0, 1000),
    previousEpochSeed: new Uint8Array(32),
    currentEpochSeed: new Uint8Array(32),

    // Finality
    previousJustifiedEpoch: randBetweenBN(0, 1000),
    justifiedEpoch: randBetweenBN(0, 1000),
    justificationBitfield: randBetweenBN(0, 1000),
    finalizedEpoch: randBetweenBN(0, 1000),

    latestCrosslinks: Array.from({length: randBetween(0, 1000)}, () => initialCrosslinkRecord),
    latestBlockRoots: Array.from({length: randBetween(0, 1000)}, () => new Uint8Array()),
    latestIndexRoots: Array.from({length: randBetween(0, 1000)}, () => new Uint8Array()),
    latestPenalizedBalances: Array.from({length: randBetween(0, 1000)}, () => randBetweenBN(0, 1000)),
    latestAttestations: [],
    batchedBlockRoots: Array.from({length: randBetween(0, 1000)}, () => new Uint8Array()),

    // PoW receipt root
    latestEth1Data: {
      depositRoot: new Uint8Array(32),
      blockHash: new Uint8Array(32),
    },
    eth1DataVotes: [],
    ...opts,
  };
}