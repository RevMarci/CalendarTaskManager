import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const RPC_URL = process.env.POLYGON_RPC_URL || '';
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '';

const contractABI = [
    "function saveDailyHash(string memory _userAndDate, string memory _taskHash) public",
    "function getDailyHash(string memory _userAndDate) public view returns (string memory)"
];

class BlockchainProvider {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(RPC_URL);

        this.wallet = new ethers.Wallet(PRIVATE_KEY, this.provider);

        this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, this.wallet);
    }

    public async saveHashToBlockchain(userAndDate: string, hash: string): Promise<string> {
        try {
            const tx = await this.contract.saveDailyHash(userAndDate, hash);
      
            const receipt = await tx.wait();
      
            return receipt.hash;
        } catch (error) {
            console.error("Hiba a blokkláncra mentés során:", error);
            throw new Error("Blockchain save failed");
        }
    }

    public async getHashFromBlockchain(userAndDate: string): Promise<string> {
        try {
            const savedHash = await this.contract.getDailyHash(userAndDate);
            return savedHash;
        } catch (error) {
            console.error("Hiba a blokkláncról való olvasás során:", error);
            throw new Error("Blockchain read failed");
        }
    }
}

export const blockchainProvider = new BlockchainProvider();
