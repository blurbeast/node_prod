import { config } from "dotenv";
import {createPublicClient, Hex, http} from 'viem';
import {toSimpleSmartAccount} from "permissionless/accounts";
import {privateKeyToAccount} from "viem/accounts";
import {sepolia, somniaTestnet} from "viem/chains";
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
            index: BigInt(salted)
        });

        return userAccount.address;
    }
}