import { formatEther, getAccount, parseEther } from "viem";
import { charityCampaignAbi } from "./abi";
import { publicClient, walletClient } from "./clients";
import { CHARITY_CAMPAIGN_ADDRESS } from "./constants";
import {
  claimFunds,
  donate,
  getCharityCampaign,
  getIndexOfCampaign,
  getOwner,
} from "./contract";
import "./style.css";

(async function () {
  const campaignContainer = document.querySelector("#current-campaign");

  await walletClient.requestAddresses();

  const addresses = await walletClient.getAddresses();

  const account = getAccount(addresses[0]);

  const currentIndexOfCampaign = await getIndexOfCampaign();

  const owner = await getOwner();

  if (owner === account.address) {
    const h2 = document.createElement("h2");
    h2.textContent = "You are the owner";
    document.querySelector("#nav")?.appendChild(h2);
  } else {
    const h2 = document.createElement("h2");
    h2.textContent = "You are not the owner";
    document.querySelector("#nav")?.appendChild(h2);
  }

  const h2 = document.createElement("h2");
  h2.textContent = `Current index of campaign: ${currentIndexOfCampaign}`;
  document.querySelector("#main")?.appendChild(h2);

  const campaign = await getCharityCampaign(currentIndexOfCampaign - BigInt(1));

  const title = document.createElement("h1");
  title.textContent = campaign.title;
  campaignContainer?.appendChild(title);

  const officialOwner = document.createElement("p");
  officialOwner.textContent = `Official owner: ${campaign.officialOwner}`;
  campaignContainer?.appendChild(officialOwner);

  const goal = document.createElement("p");
  goal.textContent = `Goal: ${formatEther(campaign.goal)} MATIC`;
  campaignContainer?.appendChild(goal);

  const balance = document.createElement("p");
  balance.textContent = `Balance: ${formatEther(campaign.balance)} MATIC`;
  campaignContainer?.appendChild(balance);

  const deadline = document.createElement("p");
  const deadlineNumber = Number(campaign.deadline.toString());
  deadline.textContent = `Deadline: ${new Date(
    deadlineNumber
  ).toLocaleString()}`;
  campaignContainer?.appendChild(deadline);

  const numberOfDonors = document.createElement("p");
  numberOfDonors.textContent = `Number Of Donors: ${campaign.numberOfDonoros}`;
  campaignContainer?.appendChild(numberOfDonors);

  const claimFundsButton = document.createElement("button");
  claimFundsButton.textContent = "Claim Funds";
  claimFundsButton.addEventListener("click", async () => {
    await claimFunds(account, currentIndexOfCampaign - BigInt(1));
  });

  campaignContainer?.appendChild(claimFundsButton);

  document
    .querySelector("#donate__button")
    ?.addEventListener("click", async () => {
      const value = (
        document.querySelector("#donate__input") as HTMLInputElement
      )?.value;
      const valueInWei = parseEther(`${parseFloat(value)}`);

      await donate(account, currentIndexOfCampaign - BigInt(1), valueInWei);
    });

  publicClient.watchContractEvent({
    abi: charityCampaignAbi,
    address: CHARITY_CAMPAIGN_ADDRESS,
    onLogs: (logs) => {
      console.log(logs);
      location.reload();
    },
    eventName: "Donate",
  });
})();
