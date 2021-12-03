import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { HemetaHemeERC20V2 } from '../../generated/HemetaTreasury/HemetaHemeERC20V2'
import { StakedHemetaHemeERC20V2 } from '../../generated/StakedHemetaHemeERC20V2/StakedHemetaHemeERC20V2'
import { HemetaStaking } from '../../generated/HemetaTreasury/HemetaStaking'
import { HemeCirculatingSupply } from '../../generated/HemetaTreasury/HemeCirculatingSupply'
import { ERC20 } from '../../generated/HemetaTreasury/ERC20'
import { UniswapV2Pair } from '../../generated/HemetaTreasury/UniswapV2Pair'

import { ProtocolMetric, Transaction } from '../../generated/schema'
import {
  CIRCULATING_SUPPLY_CONTRACT,
  CIRCULATING_SUPPLY_CONTRACT_BLOCK,
  MAI_ERC20_CONTRACT,
  FRAX_ERC20_CONTRACT,
  HEME_ERC20_CONTRACT,
  SHEME_ERC20_CONTRACT,
  STAKING_CONTRACT,
  TREASURY_ADDRESS,
  UNI_HEME_MAI_PAIR,
  UNI_HEME_FRAX_PAIR,
  UNI_HEME_FRAX_PAIR_BLOCK,
} from './Constants'
import { dayFromTimestamp } from './Dates'
import { toDecimal } from './Decimals'
import { getHEMEUSDRate, getDiscountedPairUSD, getPairUSD } from './Price'

export function loadOrCreateProtocolMetric(timestamp: BigInt): ProtocolMetric {
  let dayTimestamp = dayFromTimestamp(timestamp)

  let protocolMetric = ProtocolMetric.load(dayTimestamp)
  if (protocolMetric == null) {
    protocolMetric = new ProtocolMetric(dayTimestamp)
    protocolMetric.timestamp = timestamp
    protocolMetric.hemeCirculatingSupply = BigDecimal.fromString('0')
    protocolMetric.sHemeCirculatingSupply = BigDecimal.fromString('0')
    protocolMetric.totalSupply = BigDecimal.fromString('0')
    protocolMetric.hemePrice = BigDecimal.fromString('0')
    protocolMetric.marketCap = BigDecimal.fromString('0')
    protocolMetric.totalValueLocked = BigDecimal.fromString('0')
    protocolMetric.treasuryRiskFreeValue = BigDecimal.fromString('0')
    protocolMetric.treasuryMarketValue = BigDecimal.fromString('0')
    protocolMetric.nextEpochRebase = BigDecimal.fromString('0')
    protocolMetric.nextDistributedHeme = BigDecimal.fromString('0')
    protocolMetric.currentAPY = BigDecimal.fromString('0')
    protocolMetric.treasuryMaiRiskFreeValue = BigDecimal.fromString('0')
    protocolMetric.treasuryMaiMarketValue = BigDecimal.fromString('0')
    protocolMetric.treasuryFraxRiskFreeValue = BigDecimal.fromString('0')
    protocolMetric.treasuryFraxMarketValue = BigDecimal.fromString('0')
    protocolMetric.treasuryHemeMaiPOL = BigDecimal.fromString('0')
    protocolMetric.treasuryHemeFraxPOL = BigDecimal.fromString('0')

    protocolMetric.save()
  }
  return protocolMetric as ProtocolMetric
}

function getTotalSupply(): BigDecimal {
  let heme_contract = HemetaHemeERC20V2.bind(
    Address.fromString(HEME_ERC20_CONTRACT),
  )
  let total_supply = toDecimal(heme_contract.totalSupply(), 9)
  log.debug('Total Supply {}', [total_supply.toString()])
  return total_supply
}

function getCirculatingSupply(
  transaction: Transaction,
  total_supply: BigDecimal,
): BigDecimal {
  let circ_supply = BigDecimal.fromString('0')
  if (
    transaction.blockNumber.gt(
      BigInt.fromString(CIRCULATING_SUPPLY_CONTRACT_BLOCK),
    )
  ) {
    let circulatingSupply_contract = HemeCirculatingSupply.bind(
      Address.fromString(CIRCULATING_SUPPLY_CONTRACT),
    )
    circ_supply = toDecimal(
      circulatingSupply_contract.HEMECirculatingSupply(),
      9,
    )
  } else {
    circ_supply = total_supply
  }
  log.debug('Circulating Supply {}', [total_supply.toString()])
  return circ_supply
}

function getSHemeSupply(transaction: Transaction): BigDecimal {
  let sheme_supply = BigDecimal.fromString('0')

  let sheme_contract = StakedHemetaHemeERC20V2.bind(
    Address.fromString(SHEME_ERC20_CONTRACT),
  )
  sheme_supply = toDecimal(sheme_contract.circulatingSupply(), 9)

  log.debug('sHEME Supply {}', [sheme_supply.toString()])
  return sheme_supply
}

function getMV_RFV(transaction: Transaction): BigDecimal[] {
  let maiERC20 = ERC20.bind(Address.fromString(MAI_ERC20_CONTRACT))
  let fraxERC20 = ERC20.bind(Address.fromString(FRAX_ERC20_CONTRACT))

  let hemeMaiPair = UniswapV2Pair.bind(Address.fromString(UNI_HEME_MAI_PAIR))
  let hemeFraxPair = UniswapV2Pair.bind(Address.fromString(UNI_HEME_FRAX_PAIR))

  let treasury_address = TREASURY_ADDRESS
  let maiBalance = maiERC20.balanceOf(Address.fromString(treasury_address))
  let fraxBalance = fraxERC20.balanceOf(Address.fromString(treasury_address))

  //HEME-MAI
  let hemeMaiBalance = hemeMaiPair.balanceOf(
    Address.fromString(treasury_address),
  )
  let hemeMaiTotalLP = toDecimal(hemeMaiPair.totalSupply(), 18)
  let hemeMaiPOL = toDecimal(hemeMaiBalance, 18)
    .div(hemeMaiTotalLP)
    .times(BigDecimal.fromString('100'))
  let hemeMai_value = getPairUSD(hemeMaiBalance, UNI_HEME_MAI_PAIR)
  let hemeMai_rfv = getDiscountedPairUSD(hemeMaiBalance, UNI_HEME_MAI_PAIR)

  //HEME-FRAX
  let hemeFraxBalance = BigInt.fromI32(0)
  let hemeFrax_value = BigDecimal.fromString('0')
  let hemeFrax_rfv = BigDecimal.fromString('0')
  let hemeFraxTotalLP = BigDecimal.fromString('0')
  let hemeFraxPOL = BigDecimal.fromString('0')
  if (transaction.blockNumber.gt(BigInt.fromString(UNI_HEME_FRAX_PAIR_BLOCK))) {
    hemeFraxBalance = hemeFraxPair.balanceOf(
      Address.fromString(treasury_address),
    )
    hemeFrax_value = getPairUSD(hemeFraxBalance, UNI_HEME_FRAX_PAIR)
    hemeFrax_rfv = getDiscountedPairUSD(hemeFraxBalance, UNI_HEME_FRAX_PAIR)
    hemeFraxTotalLP = toDecimal(hemeFraxPair.totalSupply(), 18)
    if (
      hemeFraxTotalLP.gt(BigDecimal.fromString('0')) &&
      hemeFraxBalance.gt(BigInt.fromI32(0))
    ) {
      hemeFraxPOL = toDecimal(hemeFraxBalance, 18)
        .div(hemeFraxTotalLP)
        .times(BigDecimal.fromString('100'))
    }
  }

  let stableValue = maiBalance.plus(fraxBalance)
  let stableValueDecimal = toDecimal(stableValue, 18)

  let lpValue = hemeMai_value.plus(hemeFrax_value)
  let rfvLpValue = hemeMai_rfv.plus(hemeFrax_rfv)

  let mv = stableValueDecimal.plus(lpValue)
  let rfv = stableValueDecimal.plus(rfvLpValue)

  log.debug('Treasury Market Value {}', [mv.toString()])
  log.debug('Treasury RFV {}', [rfv.toString()])
  log.debug('Treasury MAI value {}', [toDecimal(maiBalance, 18).toString()])
  log.debug('Treasury Frax value {}', [toDecimal(fraxBalance, 18).toString()])
  log.debug('Treasury HEME-MAI RFV {}', [hemeMai_rfv.toString()])
  log.debug('Treasury HEME-FRAX RFV {}', [hemeFrax_rfv.toString()])

  return [
    mv,
    rfv,
    // treasuryMaiRiskFreeValue = MAI RFV * MAI + aMAI
    hemeMai_rfv.plus(toDecimal(maiBalance, 18)),
    // treasuryMaiMarketValue = MAI LP * MAI + aMAI
    hemeMai_value.plus(toDecimal(maiBalance, 18)),
    // treasuryFraxRiskFreeValue = FRAX RFV * FRAX
    hemeFrax_rfv.plus(toDecimal(fraxBalance, 18)),
    // treasuryFraxMarketValue = FRAX LP * FRAX
    hemeFrax_value.plus(toDecimal(fraxBalance, 18)),
    // POL
    hemeMaiPOL,
    hemeFraxPOL,
  ]
}

function getNextHEMERebase(transaction: Transaction): BigDecimal {
  let staking_contract = HemetaStaking.bind(Address.fromString(STAKING_CONTRACT))
  let distribution_v1 = toDecimal(staking_contract.epoch().value3, 9)
  log.debug('next_distribution v2 {}', [distribution_v1.toString()])
  let next_distribution = distribution_v1
  log.debug('next_distribution total {}', [next_distribution.toString()])
  return next_distribution
}

function getAPY_Rebase(
  sHEME: BigDecimal,
  distributedHEME: BigDecimal,
): BigDecimal[] {
  let nextEpochRebase = distributedHEME
    .div(sHEME)
    .times(BigDecimal.fromString('100'))

  let nextEpochRebase_number = Number.parseFloat(nextEpochRebase.toString())
  let currentAPY = Math.pow(nextEpochRebase_number / 100 + 1, 365 * 3 - 1) * 100

  let currentAPYdecimal = BigDecimal.fromString(currentAPY.toString())

  log.debug('next_rebase {}', [nextEpochRebase.toString()])
  log.debug('current_apy total {}', [currentAPYdecimal.toString()])

  return [currentAPYdecimal, nextEpochRebase]
}

function getRunway(
  sHEME: BigDecimal,
  rfv: BigDecimal,
  rebase: BigDecimal,
): BigDecimal[] {
  let runway2dot5k = BigDecimal.fromString('0')
  let runway5k = BigDecimal.fromString('0')
  let runway7dot5k = BigDecimal.fromString('0')
  let runway10k = BigDecimal.fromString('0')
  let runway20k = BigDecimal.fromString('0')
  let runway50k = BigDecimal.fromString('0')
  let runway70k = BigDecimal.fromString('0')
  let runway100k = BigDecimal.fromString('0')
  let runwayCurrent = BigDecimal.fromString('0')

  if (
    sHEME.gt(BigDecimal.fromString('0')) &&
    rfv.gt(BigDecimal.fromString('0')) &&
    rebase.gt(BigDecimal.fromString('0'))
  ) {
    let treasury_runway = Number.parseFloat(rfv.div(sHEME).toString())

    let runway2dot5k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.0029438) / 3
    let runway5k_num = Math.log(treasury_runway) / Math.log(1 + 0.003579) / 3
    let runway7dot5k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.0039507) / 3
    let runway10k_num = Math.log(treasury_runway) / Math.log(1 + 0.00421449) / 3
    let runway20k_num = Math.log(treasury_runway) / Math.log(1 + 0.00485037) / 3
    let runway50k_num = Math.log(treasury_runway) / Math.log(1 + 0.00569158) / 3
    let runway70k_num = Math.log(treasury_runway) / Math.log(1 + 0.00600065) / 3
    let runway100k_num =
      Math.log(treasury_runway) / Math.log(1 + 0.00632839) / 3
    let nextEpochRebase_number = Number.parseFloat(rebase.toString()) / 100
    let runwayCurrent_num =
      Math.log(treasury_runway) / Math.log(1 + nextEpochRebase_number) / 3

    runway2dot5k = BigDecimal.fromString(runway2dot5k_num.toString())
    runway5k = BigDecimal.fromString(runway5k_num.toString())
    runway7dot5k = BigDecimal.fromString(runway7dot5k_num.toString())
    runway10k = BigDecimal.fromString(runway10k_num.toString())
    runway20k = BigDecimal.fromString(runway20k_num.toString())
    runway50k = BigDecimal.fromString(runway50k_num.toString())
    runway70k = BigDecimal.fromString(runway70k_num.toString())
    runway100k = BigDecimal.fromString(runway100k_num.toString())
    runwayCurrent = BigDecimal.fromString(runwayCurrent_num.toString())
  }

  return [
    runway2dot5k,
    runway5k,
    runway7dot5k,
    runway10k,
    runway20k,
    runway50k,
    runway70k,
    runway100k,
    runwayCurrent,
  ]
}

export function updateProtocolMetrics(transaction: Transaction): void {
  let pm = loadOrCreateProtocolMetric(transaction.timestamp)

  //Total Supply
  pm.totalSupply = getTotalSupply()

  //Circ Supply
  pm.hemeCirculatingSupply = getCirculatingSupply(transaction, pm.totalSupply)

  //sHeme Supply
  pm.sHemeCirculatingSupply = getSHemeSupply(transaction)

  //HEME Price
  pm.hemePrice = getHEMEUSDRate()

  //HEME Market Cap
  pm.marketCap = pm.hemeCirculatingSupply.times(pm.hemePrice)

  //Total Value Locked
  pm.totalValueLocked = pm.sHemeCirculatingSupply.times(pm.hemePrice)

  //Treasury RFV and MV
  let mv_rfv = getMV_RFV(transaction)
  pm.treasuryMarketValue = mv_rfv[0]
  pm.treasuryRiskFreeValue = mv_rfv[1]
  pm.treasuryMaiRiskFreeValue = mv_rfv[2]
  pm.treasuryMaiMarketValue = mv_rfv[3]
  pm.treasuryFraxRiskFreeValue = mv_rfv[4]
  pm.treasuryFraxMarketValue = mv_rfv[5]
  pm.treasuryHemeMaiPOL = mv_rfv[6]
  pm.treasuryHemeFraxPOL = mv_rfv[7]

  // Rebase rewards, APY, rebase
  pm.nextDistributedHeme = getNextHEMERebase(transaction)
  let apy_rebase = getAPY_Rebase(
    pm.sHemeCirculatingSupply,
    pm.nextDistributedHeme,
  )
  pm.currentAPY = apy_rebase[0]
  pm.nextEpochRebase = apy_rebase[1]

  //Runway
  let runways = getRunway(
    pm.sHemeCirculatingSupply,
    pm.treasuryRiskFreeValue,
    pm.nextEpochRebase,
  )
  pm.runway2dot5k = runways[0]
  pm.runway5k = runways[1]
  pm.runway7dot5k = runways[2]
  pm.runway10k = runways[3]
  pm.runway20k = runways[4]
  pm.runway50k = runways[5]
  pm.runway70k = runways[6]
  pm.runway100k = runways[7]
  pm.runwayCurrent = runways[8]

  pm.save()
}
