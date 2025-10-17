'use server';

import { RestClientV5 } from 'bybit-api';

// It's highly recommended to use environment variables for API keys for security.
// For Termux, you can set them in your .bashrc or .zshrc like this:
// export BYBIT_API_KEY="YOUR_API_KEY"
// export BYBIT_API_SECRET="YOUR_API_SECRET"
// Then reload your shell or source the file.
const API_KEY = process.env.BYBIT_API_KEY || 'YOUR_API_KEY'; // Replace with your actual API key or set via environment variable
const API_SECRET = process.env.BYBIT_API_SECRET || 'YOUR_API_SECRET'; // Replace with your actual API secret or set via environment variable

// Initialize the Bybit RestClientV5
const client = new RestClientV5({
    key: API_KEY,
    secret: API_SECRET,
    // Add other options if needed, e.g., testnet: true
    // testnet: true, // Uncomment if you are using the Bybit testnet
});

/**
 * Fetches the wallet balance for a specific account type (e.g., UNIFIED, CONTRACT).
 * You can specify the coin or leave it undefined to get all coins.
 *
 * @param {string} accountType - The account type (e.g., "UNIFIED", "CONTRACT", "SPOT", "FUND").
 * @param {string} [coin] - Optional. The coin to query (e.g., "USDT", "BTC").
 * @returns {Promise<any>} - The wallet balance data.
 */
export async function getWalletBalance(accountType: 'UNIFIED' | 'CONTRACT' | 'SPOT' | 'FUND', coin?: string) {
    console.log(`Fetching wallet balance for account type: ${accountType}${coin ? `, coin: ${coin}` : ''}`);
    try {
        const response = await client.getWalletBalance({
            accountType: accountType,
            coin: coin, // Optional: if you want to filter by a specific coin
        });

        if (response.retCode === 0) {
            console.log('Wallet balance fetched successfully:', response.result);
            return response.result;
        } else {
            console.error('Error fetching wallet balance:', response.retMsg);
            return { error: response.retMsg, code: response.retCode };
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return { error: 'An unexpected error occurred', details: error };
    }
}

// Example placeholder function - remains for future expansion
export async function getAccountInformation() {
    // Implementation to be added in the future
    console.log('Fetching account information');
    return { info: 'Not yet implemented' };
}

export async function getAssetInformation() {
    // Implementation to be added in the future
    console.log('Fetching asset information');
    return { assets: 'Not yet implemented' };
}
