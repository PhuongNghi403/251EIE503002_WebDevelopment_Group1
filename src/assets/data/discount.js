// ---------------------------
// DISCOUNT CODES DATABASE 💸
// ---------------------------

window.DISCOUNT_CODES = [
  {
    code: "HELLO10",
    value: 10,
    type: "percent",
    expires: "2025-12-31T23:59:59Z",
    description: "10% off your first purchase — welcome discount!"
  },
  {
    code: "FREESHIP",
    value: 30,
    type: "fixed",
    expires: "2025-06-30T23:59:59Z",
    description: "₫30,000 off for free shipping on all orders above ₫200,000"
  },
  {
    code: "BLACKFRIDAY",
    value: 25,
    type: "percent",
    expires: "2025-11-30T23:59:59Z",
    description: "25% off during Black Friday sale!"
  },
  {
    code: "PETLOVE50",
    value: 50,
    type: "percent",
    expires: "2025-02-14T23:59:59Z",
    description: "Valentine’s Special — 50% off pet accessories!"
  },
  {
    code: "SUMMER15",
    value: 15,
    type: "percent",
    expires: "2025-08-31T23:59:59Z",
    description: "Beat the heat with 15% off summer items!"
  },
  {
    code: "TRYME5",
    value: 5,
    type: "fixed",
    expires: "2025-03-31T23:59:59Z",
    description: "₫5,000 off any order — small gift for trying our store 💕"
  }
];

// ---------------------------
// DISCOUNT HELPERS
// ---------------------------
// tìm mã trong danh sách
window.findDiscount = function (code) {
  code = code.trim().toUpperCase();
  const now = new Date();
  return window.DISCOUNT_CODES.find(
    (d) => d.code === code && new Date(d.expires) > now
  );
};

// kiểm tra mã hợp lệ và thông báo kết quả
window.validateDiscount = function (code) {
  const discount = window.findDiscount(code);
  if (!discount) {
    if (typeof showNotification === "function") {
      showNotification(`Code "${code}" is invalid or expired.`, "error");
    } else {
      alert(`Code "${code}" is invalid or expired.`);
    }
    return null;
  }
  if (typeof showNotification === "function") {
    showNotification(
      `Code "${code}" applied: ${
        discount.type === "percent"
          ? discount.value + "%"
          : "₫" + discount.value.toLocaleString()
      } off!`,
      "success"
    );
  } else {
    alert(`Code "${code}" applied successfully!`);
  }
  return discount;
};