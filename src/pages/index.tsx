"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import axios from "axios";
import { createCoupon, getUserCoupons, withdrawCoupon } from "@/service/blockchain";

interface CouponStruct {
  id: number;
  organisationId: string;
  adminWallet: string;
  discountAmount: number;
  isUsed: boolean;
  isActive: boolean;
  userEmail: string;
}

export default function LoyaltyCouponApp() {
  const { isConnected, address } = useAccount();
  const [activeTab, setActiveTab] = useState("login");
  const [isAdmin, setIsAdmin] = useState(false);
  const [coupons, setCoupons] = useState<CouponStruct[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});
  const [org, setOrg] = useState([]);
  const [couponAmount, setCouponAmount] = useState(""); // State for coupon amount
  const [userEmail, setUserEmail] = useState("");

  const getUserData = async () => {
    const res = await axios.get(`http://127.0.0.1:4000/users/${address}/user`);
    if (res.data) {
      setLogin(true);
      setUser(res.data);
    }
  };

  const getUserOrganizations = async () => {
    console.log("fetching data");
    const res = await axios.get(
      `http://127.0.0.1:4000/organizations/${user.email}/org`
    );
    setOrg(res.data);
  };

  const getCoupons = async () => {
    if (isConnected && address) {
      const coup: CouponStruct[] = await getUserCoupons(address);
      console.log(coup);
      setCoupons(coup);
    }
  };

  useEffect(() => {
    if (isConnected) {
      getUserData();
      getUserOrganizations();
      getCoupons();
      console.log(org);
    }
  }, [address, activeTab, isConnected]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const walletAddress = address;

    try {
      const response = await axios.post("http://127.0.0.1:4000/users", {
        email,
        walletAddress,
      });

      console.log("User created successfully:", response.data);

      // Logic after successful user creation
      // Example: set admin state and redirect to dashboard
      // setIsAdmin(true); // Replace with actual state logic
      setActiveTab("dashboard"); // Replace with navigation logic
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    // TODO: Implement organization creation logic
    try {
      const res = await axios.get(
        `http://127.0.0.1:4000/users/${address}/user`
      );
      console.log(res.data);
      const adminId = res.data.email;
      console.log(email);
      const response = await axios.post("http://127.0.0.1:4000/organizations", {
        name,
        adminId,
      });

      console.log("Org created successfully:", response.data);

      setIsAdmin(true);
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleCreateCoupon = async (organizationId: string) => {
    try {
      if (isConnected && address) {
        await createCoupon(organizationId, userEmail, Number(couponAmount), address);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleShareCoupon = (couponId) => {
    // TODO: Implement coupon sharing logic
    alert(`Sharing coupon ${couponId}`);
  };

  const handleUseCoupon = async(couponId) => {
    try {
      if (isConnected && address) {
        await withdrawCoupon(couponId);
      }
    } catch (error) {
      console.error("Error getting discount:", error);
    }
  };

  const handleLinkWallet = (e) => {
    e.preventDefault();
    // TODO: Implement wallet linking logic
    alert("Wallet linked successfully!");
  };

  return (
    <div>
      <div className="w-[100%] flex flex-col">
        <header className="flex w-[100%] flex-row justify-between m-10">
          <h1>Assignment</h1>
          <ConnectButton />
        </header>
      </div>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Loyalty Coupon App</h1>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TabsList
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              marginBottom: "16px",
              borderBottom: "2px solid #ddd",
              paddingBottom: "8px",
            }}
          >
            <TabsTrigger
              value="login"
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "login" ? "#007BFF" : "transparent",
                color: activeTab === "login" ? "#fff" : "#333",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                border: "none",
                outline: "none",
              }}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="createOrg"
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "createOrg" ? "#007BFF" : "transparent",
                color: activeTab === "createOrg" ? "#fff" : "#333",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                border: "none",
                outline: "none",
              }}
            >
              Create Organization
            </TabsTrigger>
            <TabsTrigger
              value="allOrg"
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "allOrg" ? "#007BFF" : "transparent",
                color: activeTab === "allOrg" ? "#fff" : "#333",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                border: "none",
                outline: "none",
              }}
            >
              All Organizations
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor:
                  activeTab === "dashboard" ? "#007BFF" : "transparent",
                color: activeTab === "dashboard" ? "#fff" : "#333",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                border: "none",
                outline: "none",
              }}
            >
              Dashboard
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            {login ? (
              <Card>
                <CardHeader>
                  <CardTitle>User Data</CardTitle>
                </CardHeader>
                <CardContent>{user?.email}</CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-2"
                    />
                    <Button type="submit">Login</Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="createOrg">
            <Card
              style={{
                maxWidth: "400px",
                margin: "20px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
              }}
            >
              <CardHeader
                style={{
                  borderBottom: "1px solid #eee",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                <CardTitle
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Create Organization
                </CardTitle>
              </CardHeader>
              <CardContent
                style={{
                  padding: "0 16px",
                }}
              >
                <form
                  onSubmit={handleCreateOrg}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <Input
                    placeholder="Organization Name"
                    style={{
                      padding: "10px",
                      fontSize: "14px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Button
                    type="submit"
                    style={{
                      padding: "10px 15px",
                      fontSize: "16px",
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#0056b3")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#007BFF")
                    }
                  >
                    Create
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="allOrg">
            <Card
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardHeader
                style={{
                  backgroundColor: "#f7f7f7",
                  padding: "12px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <CardTitle
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  All Organizations
                </CardTitle>
              </CardHeader>
              <CardContent style={{ padding: "16px" }}>
                {org.map((organization, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "16px",
                      padding: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      <span style={{ color: "#555" }}>Organization Name: </span>
                      {organization.name}
                    </p>
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <span style={{ color: "#555" }}>Admin ID: </span>
                      {organization.adminId}
                    </p>
                    <p
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <span style={{ color: "#555" }}>Org ID: </span>
                      {organization._id}
                    </p>
                    <form
                      onSubmit={() => handleCreateCoupon(organization._id)}
                      className="mb-4"
                    >
                      <input
                        style={{
                          margin: "0 0 12px 0",
                        }}
                        placeholder="Coupon Amount"
                        type="number"
                        className="mb-2"
                        value={couponAmount}
                        onChange={(e) => setCouponAmount(e.target.value)}
                      />
                      <input
                        style={{
                          margin: "0 0 12px 0",
                        }}
                        placeholder="User Email"
                        type="email"
                        className="mb-2"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                      />
                      <button
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                        type="submit"
                      >
                        Create Coupon
                      </button>
                    </form>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Your Coupons</h3>
                {coupons.length === 0 ? (
                  <p>No coupons available.</p>
                ) : (
                  <ul style={{ listStyleType: "none", padding: 0 }}>
                    {coupons.map((coupon) => (
                      <li
                        key={coupon.id}
                        style={{
                          marginBottom: "12px",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          backgroundColor: "#f9f9f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            Coupon Code: {coupon.id}
                          </span>
                          <span style={{ fontSize: "14px", color: "#666" }}>
                            Discount: {coupon.discountAmount} ETH
                          </span>
                        </div>
                        <div>
                          <Button
                            onClick={() => handleUseCoupon(coupon.id)}
                            style={{
                              marginLeft: "8px",
                              backgroundColor: "#28a745",
                              color: "#fff",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#1e7e34")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#28a745")
                            }
                          >
                            Claim
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
