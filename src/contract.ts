import { Account } from "viem";
import { charityCampaignAbi } from "./abi";
import { publicClient, walletClient } from "./clients";
import { CHARITY_CAMPAIGN_ADDRESS } from "./constants";

export async function getIndexOfCampaign() {
  const response = await publicClient.readContract({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    functionName: "indexOfCampaign",
  });

  return response;
}

export async function getOwner() {
  const response = await publicClient.readContract({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    functionName: "owner",
  });

  return response;
}

export async function getCharityCampaign(campaignId: bigint) {
  const response = await publicClient.readContract({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    functionName: "getChampaign",
    args: [campaignId],
  });

  return response;
}

export async function donate(
  account: Account,
  campaignId: bigint,
  value: bigint
) {
  const response = await walletClient.writeContract({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    account: account,
    functionName: "sendFunds",
    args: [campaignId],
    value: value,
  });

  return response;
}

export async function claimFunds(account: Account, campaignId: bigint) {
  const response = await walletClient.writeContract({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    account: account,
    functionName: "claimFunds",
    args: [campaignId],
  });

  return response;
}
