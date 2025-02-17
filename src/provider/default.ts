import { StarknetChainId } from '../constants';
import {
  Call,
  CallContractResponse,
  ContractClass,
  DeclareContractPayload,
  DeclareContractResponse,
  DeployContractPayload,
  DeployContractResponse,
  EstimateFeeResponse,
  GetBlockResponse,
  GetCodeResponse,
  GetTransactionReceiptResponse,
  GetTransactionResponse,
  Invocation,
  InvocationsDetailsWithNonce,
  InvokeFunctionResponse,
} from '../types';
import { BigNumberish } from '../utils/number';
import { ProviderInterface } from './interface';
import { RpcProvider, RpcProviderOptions } from './rpc';
import { SequencerProvider, SequencerProviderOptions } from './sequencer';
import { BlockIdentifier } from './utils';

export interface ProviderOptions {
  sequencer?: SequencerProviderOptions;
  rpc?: RpcProviderOptions;
}

export class Provider implements ProviderInterface {
  private provider!: ProviderInterface;

  constructor(providerOrOptions?: ProviderOptions | ProviderInterface) {
    if (providerOrOptions && 'chainId' in providerOrOptions) {
      this.provider = providerOrOptions;
    } else if (providerOrOptions?.rpc) {
      this.provider = new RpcProvider(providerOrOptions.rpc);
    } else if (providerOrOptions?.sequencer) {
      this.provider = new SequencerProvider(providerOrOptions.sequencer);
    } else {
      this.provider = new SequencerProvider();
    }
  }

  public get chainId(): StarknetChainId {
    return this.provider.chainId;
  }

  public async getChainId(): Promise<StarknetChainId> {
    return this.provider.getChainId();
  }

  public async getBlock(blockIdentifier: BlockIdentifier = 'pending'): Promise<GetBlockResponse> {
    return this.provider.getBlock(blockIdentifier);
  }

  public async getClassAt(
    contractAddress: string,
    blockIdentifier: BlockIdentifier = 'pending'
  ): Promise<ContractClass> {
    return this.provider.getClassAt(contractAddress, blockIdentifier);
  }

  public async getEstimateFee(
    invocation: Invocation,
    invocationDetails: InvocationsDetailsWithNonce,
    blockIdentifier: BlockIdentifier = 'pending'
  ): Promise<EstimateFeeResponse> {
    return this.provider.getEstimateFee(invocation, invocationDetails, blockIdentifier);
  }

  public async getNonce(
    contractAddress: string,
    blockIdentifier?: BlockIdentifier
  ): Promise<BigNumberish> {
    return this.provider.getNonce(contractAddress, blockIdentifier);
  }

  public async getStorageAt(
    contractAddress: string,
    key: BigNumberish,
    blockIdentifier: BlockIdentifier = 'pending'
  ): Promise<BigNumberish> {
    return this.provider.getStorageAt(contractAddress, key, blockIdentifier);
  }

  public async getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse> {
    return this.provider.getTransaction(txHash);
  }

  public async getTransactionReceipt(txHash: BigNumberish): Promise<GetTransactionReceiptResponse> {
    return this.provider.getTransactionReceipt(txHash);
  }

  public async callContract(
    request: Call,
    blockIdentifier: BlockIdentifier = 'pending'
  ): Promise<CallContractResponse> {
    return this.provider.callContract(request, blockIdentifier);
  }

  public async invokeFunction(
    functionInvocation: Invocation,
    details: InvocationsDetailsWithNonce
  ): Promise<InvokeFunctionResponse> {
    return this.provider.invokeFunction(functionInvocation, details);
  }

  public async deployContract(payload: DeployContractPayload): Promise<DeployContractResponse> {
    return this.provider.deployContract(payload);
  }

  public async declareContract(payload: DeclareContractPayload): Promise<DeclareContractResponse> {
    return this.provider.declareContract(payload);
  }

  public async getCode(
    contractAddress: string,
    blockIdentifier?: BlockIdentifier
  ): Promise<GetCodeResponse> {
    return this.provider.getCode(contractAddress, blockIdentifier);
  }

  public async waitForTransaction(txHash: BigNumberish, retryInterval?: number): Promise<void> {
    return this.provider.waitForTransaction(txHash, retryInterval);
  }
}
