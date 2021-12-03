// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class HemeCirculatingSupply extends ethereum.SmartContract {
  static bind(address: Address): HemeCirculatingSupply {
    return new HemeCirculatingSupply("HemeCirculatingSupply", address);
  }

  HEME(): Address {
    let result = super.call("HEME", "HEME():(address)", []);

    return result[0].toAddress();
  }

  try_HEME(): ethereum.CallResult<Address> {
    let result = super.tryCall("HEME", "HEME():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  HEMECirculatingSupply(): BigInt {
    let result = super.call(
      "HEMECirculatingSupply",
      "HEMECirculatingSupply():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_HEMECirculatingSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "HEMECirculatingSupply",
      "HEMECirculatingSupply():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getNonCirculatingHEME(): BigInt {
    let result = super.call(
      "getNonCirculatingHEME",
      "getNonCirculatingHEME():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getNonCirculatingHEME(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getNonCirculatingHEME",
      "getNonCirculatingHEME():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  initialize(_heme: Address): boolean {
    let result = super.call("initialize", "initialize(address):(bool)", [
      ethereum.Value.fromAddress(_heme)
    ]);

    return result[0].toBoolean();
  }

  try_initialize(_heme: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("initialize", "initialize(address):(bool)", [
      ethereum.Value.fromAddress(_heme)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isInitialized(): boolean {
    let result = super.call("isInitialized", "isInitialized():(bool)", []);

    return result[0].toBoolean();
  }

  try_isInitialized(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isInitialized", "isInitialized():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  nonCirculatingHEMEAddresses(param0: BigInt): Address {
    let result = super.call(
      "nonCirculatingHEMEAddresses",
      "nonCirculatingHEMEAddresses(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_nonCirculatingHEMEAddresses(
    param0: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "nonCirculatingHEMEAddresses",
      "nonCirculatingHEMEAddresses(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  setNonCirculatingHEMEAddresses(
    _nonCirculatingAddresses: Array<Address>
  ): boolean {
    let result = super.call(
      "setNonCirculatingHEMEAddresses",
      "setNonCirculatingHEMEAddresses(address[]):(bool)",
      [ethereum.Value.fromAddressArray(_nonCirculatingAddresses)]
    );

    return result[0].toBoolean();
  }

  try_setNonCirculatingHEMEAddresses(
    _nonCirculatingAddresses: Array<Address>
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "setNonCirculatingHEMEAddresses",
      "setNonCirculatingHEMEAddresses(address[]):(bool)",
      [ethereum.Value.fromAddressArray(_nonCirculatingAddresses)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferOwnership(_owner: Address): boolean {
    let result = super.call(
      "transferOwnership",
      "transferOwnership(address):(bool)",
      [ethereum.Value.fromAddress(_owner)]
    );

    return result[0].toBoolean();
  }

  try_transferOwnership(_owner: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferOwnership",
      "transferOwnership(address):(bool)",
      [ethereum.Value.fromAddress(_owner)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _heme(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class SetNonCirculatingHEMEAddressesCall extends ethereum.Call {
  get inputs(): SetNonCirculatingHEMEAddressesCall__Inputs {
    return new SetNonCirculatingHEMEAddressesCall__Inputs(this);
  }

  get outputs(): SetNonCirculatingHEMEAddressesCall__Outputs {
    return new SetNonCirculatingHEMEAddressesCall__Outputs(this);
  }
}

export class SetNonCirculatingHEMEAddressesCall__Inputs {
  _call: SetNonCirculatingHEMEAddressesCall;

  constructor(call: SetNonCirculatingHEMEAddressesCall) {
    this._call = call;
  }

  get _nonCirculatingAddresses(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }
}

export class SetNonCirculatingHEMEAddressesCall__Outputs {
  _call: SetNonCirculatingHEMEAddressesCall;

  constructor(call: SetNonCirculatingHEMEAddressesCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}