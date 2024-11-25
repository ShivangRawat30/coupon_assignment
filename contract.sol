// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.22;

contract CouponTest {
    uint256 private couponNumber;
    struct Coupon {
        uint256 id;
        string organisationId;
        address adminWallet;
        uint256 discountAmount;
        bool isUsed;
        bool isActive;
        string userEmail;
    }
    mapping(address => uint256) public userCoupNumber;
    mapping(uint256 => Coupon) public coupon;
    mapping(string => Coupon) public orgCoupons;
    mapping(address => Coupon[]) public userCoupons;

    constructor() {}

    function createCoupon(
        string memory orgId,
        string memory userEmail,
        uint256 _discountAmount,
        address wallet
    ) public payable {
        couponNumber++;
        Coupon memory coup = Coupon({
            id: couponNumber,
            organisationId: orgId,
            adminWallet: wallet,
            discountAmount: _discountAmount,
            isUsed: false,
            isActive: true,
            userEmail: userEmail
        });
        orgCoupons[orgId] = coup;
        coupon[couponNumber] = coup;
        uint256 number = userCoupNumber[wallet]++;
        userCoupons[wallet].push(coup);
    }

    function widthdrawCoupon(uint256 couponId) public {
        require(
            coupon[couponId].adminWallet == msg.sender,
            "you are not the user"
        );
        coupon[couponId].isUsed = true;
        userCoupons[msg.sender][couponId].isUsed = true;
        payTo(msg.sender, coupon[couponId].discountAmount);
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getCouponById(uint256 couponId) public view returns (Coupon memory) {
        require(couponId > 0 && couponId <= couponNumber, "Invalid coupon ID");
        return coupon[couponId];
    }

    // Get coupon details by organization ID
    function getCouponByOrgId(string memory orgId) public view returns (Coupon memory) {
        require(bytes(orgId).length > 0, "Invalid organization ID");
        Coupon memory orgCoupon = orgCoupons[orgId];
        require(orgCoupon.id != 0, "No coupon found for this organization");
        return orgCoupon;
    }

    // Get total number of coupons created
    function getTotalCouponsCreated() public view returns (uint256) {
        return couponNumber;
    }

    // Get number of coupons for a specific user
    function getUserCouponCount(address userWallet) public view returns (uint256) {
        require(userWallet != address(0), "Invalid wallet address");
        return userCoupNumber[userWallet];
    }

    // Get all coupons for a specific user
    function getUserCoupons(address userWallet) public view returns (Coupon[] memory) {
        require(userWallet != address(0), "Invalid wallet address");
        
        Coupon[] memory allCoupons = userCoupons[userWallet];
        uint256 validCount = 0;

        // Count valid coupons first
        for (uint256 i = 0; i < allCoupons.length; i++) {
            if (!allCoupons[i].isUsed) {
                validCount++;
            }
        }

        // Create a new array with the exact count
        Coupon[] memory validCoupons = new Coupon[](validCount);
        uint256 index = 0;

        for (uint256 i = 0; i < allCoupons.length; i++) {
            if (!allCoupons[i].isUsed) {
                validCoupons[index] = allCoupons[i];
                index++;
            }
        }

        return validCoupons;
    }

    // Check if a coupon is active
    function isCouponActive(uint256 couponId) public view returns (bool) {
        require(couponId > 0 && couponId <= couponNumber, "Invalid coupon ID");
        return coupon[couponId].isActive;
    }

    // Check if a coupon has been used
    function isCouponUsed(uint256 couponId) public view returns (bool) {
        require(couponId > 0 && couponId <= couponNumber, "Invalid coupon ID");
        return coupon[couponId].isUsed;
    }

    // Get coupon discount amount
    function getCouponDiscountAmount(uint256 couponId) public view returns (uint256) {
        require(couponId > 0 && couponId <= couponNumber, "Invalid coupon ID");
        return coupon[couponId].discountAmount;
    }
}
