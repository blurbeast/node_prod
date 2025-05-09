import { config } from "dotenv";
import {createPublicClient, createWalletClient, getAddress, getContract, Hex, http, parseAbi} from 'viem';
import {toSimpleSmartAccount} from "permissionless/accounts";
import {privateKeyToAccount} from "viem/accounts";
import { somniaTestnet} from "viem/chains";
import { entryPoint07Address } from "viem/account-abstraction";
config();

export class PermissionlessService {

    publicClient() {
        return createPublicClient({
            transport: http('https://dream-rpc.somnia.network'),
            chain: somniaTestnet
        });
    }

    async account(salted: number) {
        const userAccount = await toSimpleSmartAccount({
            client: this.publicClient(),
            owner: privateKeyToAccount(('0x' + process.env.WALLET_KEY) as Hex),
            entryPoint: {
                address: entryPoint07Address,
                version: '0.7'
            },
            index: BigInt(salted)
        });

        return userAccount.address;
    }

    walletClient() {
        return createWalletClient({
            transport: http(''),
            chain: somniaTestnet,   
            account: privateKeyToAccount((
                '0x' + process.env.WALLET_KEY
            ) as Hex)
        });
    }

    async getContractInstance(contractAddress: string, contractAbi: any) {
        return getContract({
            address: getAddress(contractAddress),
            abi: contractAbi,
            client: {
                public: this.publicClient(),
                wallet: this.walletClient()
            }
        })
    }
}