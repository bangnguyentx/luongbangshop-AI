console.log("app.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const openSearchBtn = document.getElementById("openSearchBtn");
  const mobileSearch = document.getElementById("mobileSearch");
  const globalSearchInput = document.getElementById("globalSearchInput");
  const closeNoticeBtn = document.getElementById("closeNoticeBtn");
  const hideNoticeBtn = document.getElementById("hideNoticeBtn");
  const noticeModal = document.getElementById("noticeModal");
  const productModal = document.getElementById("productModal");
  const closeProductBtn = document.getElementById("closeProductBtn");

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("hidden");
      if (mobileSearch) mobileSearch.classList.add("hidden");
    });
  }

  if (openSearchBtn && mobileSearch) {
    openSearchBtn.addEventListener("click", () => {
      mobileSearch.classList.toggle("hidden");
      if (mobileDrawer) mobileDrawer.classList.add("hidden");
      if (!mobileSearch.classList.contains("hidden") && globalSearchInput) {
        globalSearchInput.focus();
      }
    });
  }

  if (closeNoticeBtn && noticeModal) {
    closeNoticeBtn.addEventListener("click", () => {
      noticeModal.classList.remove("show");
    });
  }

  if (hideNoticeBtn && noticeModal) {
    hideNoticeBtn.addEventListener("click", () => {
      noticeModal.classList.remove("show");
    });
  }

  if (closeProductBtn && productModal) {
    closeProductBtn.addEventListener("click", () => {
      productModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  }

  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) {
        productModal.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (noticeModal) noticeModal.classList.remove("show");
      if (productModal) {
        productModal.classList.remove("show");
        document.body.classList.remove("modal-open");
      }
    }
  });
});
