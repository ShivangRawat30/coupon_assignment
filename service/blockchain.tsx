import { ethers } from "ethers";
import address from "@/contractAddress.json";
import abi from "@/abi.json";

const toWei = (num: number) => ethers.parseEther(num.toString());
const fromWei = (num: number) => ethers.formatEther(num);

let ethereum: any;
let tx: any;

if (typeof window !== "undefined") ethereum = window.ethereum;

interface CouponStruct {
  id: number;
  organisationId: string;
  adminWallet: string;
  discountAmount: number;
  isUsed: boolean;
  isActive: boolean;
  userEmail: string;
}

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: "eth_accounts" });

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address.contractAddress, abi, signer);
    return contract;
  } else {
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const wallet = ethers.Wallet.createRandom();
    const signer = wallet.connect(provider);
    const contract = new ethers.Contract(address.contractAddress, abi, signer);
    return contract;
  }
};

const getUserCoupons = async (
  walletAddress: string
): Promise<CouponStruct[]> => {
  const contract = await getEthereumContracts();
  const coupons = await contract.getUserCoupons(walletAddress);
  return structuredCoupons(coupons);
};

const createCoupon = async (
  orgId: string,
  userEmail: string,
  discount: number,
  address: string
): Promise<void> => {
  if (!ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Brower provider not installed"));
  }
  console.log(toWei(discount));

  try {
    const contract = await getEthereumContracts();
    tx = await contract.createCoupon(orgId, userEmail, toWei(discount), address, {
      value: toWei(discount),
    });
    await tx.wait();

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    return Promise.reject(error);
  }
};

const withdrawCoupon = async (couponId: number): Promise<void> => {
  if (!ethereum) {
    reportError("Please install a browser provider");
    return Promise.reject(new Error("Brower provider not installed"));
  }

  try {
    const contract = await getEthereumContracts();
    tx = await contract.widthdrawCoupon(couponId);
    await tx.wait();

    return Promise.resolve(tx);
  } catch (error) {
    reportError(error);
    return Promise.reject(error);
  }
};

const structuredCoupons = (coupons: CouponStruct[]): CouponStruct[] =>
  coupons.map((coupon) => ({
    // Cast id and discountAmount to bigint if necessary (assuming they are strings)
    id: Number(coupon.id),
    organisationId: coupon.organisationId,
    adminWallet: coupon.adminWallet,
    discountAmount: Number(fromWei(coupon.discountAmount)),
    isUsed: coupon.isUsed,
    isActive: coupon.isActive,
    userEmail: coupon.userEmail,
  }));

export { getUserCoupons, createCoupon, withdrawCoupon };
