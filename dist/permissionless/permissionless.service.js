"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionlessService = void 0;
const dotenv_1 = require("dotenv");
const viem_1 = require("viem");
const accounts_1 = require("permissionless/accounts");
const accounts_2 = require("viem/accounts");
const chains_1 = require("viem/chains");
const account_abstraction_1 = require("viem/account-abstraction");
(0, dotenv_1.config)();
class PermissionlessService {
    publicClient() {
        return (0, viem_1.createPublicClient)({
            transport: (0, viem_1.http)('https://dream-rpc.somnia.network'),
            chain: chains_1.somniaTestnet
        });
    }
    async account(salted) {
        const userAccount = await (0, accounts_1.toSimpleSmartAccount)({
            client: this.publicClient(),
            owner: (0, accounts_2.privateKeyToAccount)(('0x' + process.env.WALLET_KEY)),
            entryPoint: {
                address: account_abstraction_1.entryPoint07Address,
                version: '0.7'
            },
            index: BigInt(salted)
        });
        return userAccount.address;
    }
    walletClient() {
        return (0, viem_1.createWalletClient)({
            transport: (0, viem_1.http)(''),
            chain: chains_1.somniaTestnet,
            account: (0, accounts_2.privateKeyToAccount)(('0x' + process.env.WALLET_KEY))
        });
    }
    async getContractInstance(contractAddress, contractAbi) {
        return (0, viem_1.getContract)({
            address: (0, viem_1.getAddress)(contractAddress),
            abi: contractAbi,
            client: {
                public: this.publicClient(),
                wallet: this.walletClient()
            }
        });
    }
}
exports.PermissionlessService = PermissionlessService;
