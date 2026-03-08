const ADMIN_EMAIL = "adminlaanh89@gmail.com";
    const FACEBOOK_LINK = "https://m.me/bang.nguyen.17040";
    const TELEGRAM_LINK = "https://t.me/NgoNam89";

    const KEYS = {
      session: "bang_shop_ai_session_v3",
      site: "bang_shop_ai_site_v3",
      products: "bang_shop_ai_products_v3",
      notice: "bang_shop_ai_notice_v3",
      policy: "bang_shop_ai_policy_v3",
      contact: "bang_shop_ai_contact_v3",
      noticeHiddenUntil: "bang_shop_ai_notice_hidden_until_v3"
    };

    const defaultSite = {
      heroTitle: "Kho sản phẩm AI Tool mobile-first",
      heroDesc: "Giao diện gọn đẹp, dễ nhìn trên điện thoại, khách xem sản phẩm nhanh, admin chủ động thêm sản phẩm và nội dung.",
      bannerImage: ""
    };

    const defaultNotice = {
      title: "Chào mừng bạn đến với Bằng AI Tool Shop",
      content:
`Dưới đây là vài lưu ý quan trọng trước khi mua hàng:

Bảo hành rõ ràng trong quá trình sử dụng

Không chia sẻ thông tin: vui lòng không đổi email/mật khẩu nếu gói bạn mua là "dùng chung” (nếu là “tài khoản riêng” thì sẽ có hướng dẫn riêng).

Cần hỗ trợ nhanh? Nhắn Zalo/Inbox để được xử lý

? Liên hệ hỗ trợ (Zalo): 0399834208
? Liên hệ hỗ trợ 2 (Telegram): Ngô Nam
? Thời gian hỗ trợ: 9:00 - 22:00 (mỗi ngày)`
    };

    const defaultPolicy = {
      bannerImage: "",
      content:
`1) Giới thiệu

Bằng AI Tool Shop cam kết tôn trọng và bảo vệ thông tin của khách hàng.

2) Quy định sử dụng

Vui lòng sử dụng sản phẩm đúng mục đích. Không chia sẻ thông tin tài khoản khi gói dùng chung.

3) Hỗ trợ

Nếu gặp vấn đề, vui lòng liên hệ Zalo hoặc Telegram để được xử lý nhanh.`
    };

    const defaultContact = {
      address: "Việt Nam",
      phone: "0399834208",
      email: "bangnguyen02@gmail.com",
      desc: "Bằng AI Tool Shop - Website trưng bày sản phẩm AI Tool, phần mềm và công cụ số."
    };

    let currentUserEmail = "";
    let isAdmin = false;
    let activeCategory = "all";

    const loginScreen = document.getElementById("loginScreen");
    const app = document.getElementById("app");
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("emailInput");
    const loginError = document.getElementById("loginError");

    const menuBtn = document.getElementById("menuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const openSearchBtn = document.getElementById("openSearchBtn");
    const mobileSearch = document.getElementById("mobileSearch");
    const globalSearchInput = document.getElementById("globalSearchInput");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutDesktop = document.getElementById("logoutDesktop");

    const adminSection = document.getElementById("adminSection");

    const heroBanner = document.getElementById("heroBanner");
    const heroTitle = document.getElementById("heroTitle");
    const heroText = document.getElementById("heroText");

    const productsGrid = document.getElementById("productsGrid");
    const emptyBox = document.getElementById("emptyBox");
    const categoryTabs = document.getElementById("categoryTabs");
    const featureCategoryTitle = document.getElementById("featureCategoryTitle");
    const featureCategoryText = document.getElementById("featureCategoryText");

    const childParent = document.getElementById("childParent");

    const policyBanner = document.getElementById("policyBanner");
    const policyContent = document.getElementById("policyContent");

    const contactAddress = document.getElementById("contactAddress");
    const contactPhone = document.getElementById("contactPhone");
    const contactEmail = document.getElementById("contactEmail");
    const contactDesc = document.getElementById("contactDesc");

    const noticeModal = document.getElementById("noticeModal");
    const noticeModalContent = document.getElementById("noticeModalContent");
    const closeNoticeBtn = document.getElementById("closeNoticeBtn");
    const hideNoticeBtn = document.getElementById("hideNoticeBtn");

    const productModal = document.getElementById("productModal");
    const closeProductBtn = document.getElementById("closeProductBtn");
    const modalParentName = document.getElementById("modalParentName");
    const modalParentDesc = document.getElementById("modalParentDesc");
    const modalParentCode = document.getElementById("modalParentCode");
    const modalChildCount = document.getElementById("modalChildCount");
    const modalChildList = document.getElementById("modalChildList");

    function escapeHtml(text) {
      return String(text || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function nl2br(text) {
      return escapeHtml(text).replace(/\n/g, "<br>");
    }

    function isValidGmail(email) {
      return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());
    }

    function formatCurrency(value) {
      return Number(value || 0).toLocaleString("vi-VN") + "đ";
    }

    function createId(prefix) {
      return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
    }

    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          resolve("");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function getStorage(key, fallback) {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
      } catch {
        return fallback;
      }
    }

    function setStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }

    function getSite() {
      return getStorage(KEYS.site, defaultSite);
    }

    function getProducts() {
      return getStorage(KEYS.products, []);
    }

    function getNotice() {
      return getStorage(KEYS.notice, defaultNotice);
    }

    function getPolicy() {
      return getStorage(KEYS.policy, defaultPolicy);
    }

    function getContact() {
      return getStorage(KEYS.contact, defaultContact);
    }

    function renderSite() {
      const site = getSite();

      heroTitle.textContent = site.heroTitle || defaultSite.heroTitle;
      heroText.textContent = site.heroDesc || defaultSite.heroDesc;

      if (site.bannerImage) {
        heroBanner.style.backgroundImage = `linear-gradient(rgba(8,14,28,.38), rgba(8,14,28,.56)), url('${site.bannerImage}')`;
      } else {
        heroBanner.style.backgroundImage = "";
      }
    }

    function renderPolicy() {
      const policy = getPolicy();

      if (policy.bannerImage) {
        policyBanner.style.backgroundImage = `linear-gradient(rgba(8,14,28,.42), rgba(8,14,28,.54)), url('${policy.bannerImage}')`;
      } else {
        policyBanner.style.backgroundImage = "";
      }

      policyContent.innerHTML = `<div class="rich-text">${nl2br(policy.content || defaultPolicy.content)}</div>`;
    }

    function renderContact() {
      const data = getContact();
      contactAddress.textContent = data.address || defaultContact.address;
      contactPhone.textContent = data.phone || defaultContact.phone;
      contactEmail.textContent = data.email || defaultContact.email;
      contactDesc.textContent = data.desc || defaultContact.desc;
    }

    function renderParentSelect() {
      const products = getProducts();
      childParent.innerHTML = "";

      if (!products.length) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Chưa có sản phẩm chính";
        childParent.appendChild(option);
        return;
      }

      products.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name} (${item.code})`;
        childParent.appendChild(option);
      });
    }

    function getCategories() {
      const products = getProducts();
      const list = products.map((p) => (p.category || "Khác").trim()).filter(Boolean);
      return ["all", ...new Set(list)];
    }

    function renderCategories() {
      const cats = getCategories();
      categoryTabs.innerHTML = "";

      cats.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "category-tab" + (cat === activeCategory ? " active" : "");
        btn.type = "button";
        btn.textContent = cat === "all" ? "Tất cả sản phẩm" : cat;
        btn.addEventListener("click", () => {
          activeCategory = cat;
          renderCategories();
          renderProducts();
        });
        categoryTabs.appendChild(btn);
      });

      if (activeCategory !== "all") {
        featureCategoryTitle.classList.remove("hidden");
        featureCategoryText.textContent = activeCategory;
      } else {
        featureCategoryTitle.classList.add("hidden");
      }
    }

    function buildChildPurchaseLink(parent, child) {
      const text = encodeURIComponent(
        `Chào admin, mình muốn mua ${child.name} - mã ${child.code} thuộc ${parent.name}`
      );
      return `${FACEBOOK_LINK}?ref=bookmarks&message=${text}`;
    }

    function createProductCard(product) {
      const article = document.createElement("article");
      article.className = "product-card";

      const imageHtml = product.image
        ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-thumb" />`
        : `<div class="product-thumb-fallback">${escapeHtml(product.code)}</div>`;

      const childCount = Array.isArray(product.children) ? product.children.length : 0;

      article.innerHTML = `
        <div class="product-thumb-wrap">
          ${imageHtml}
        </div>
        <div class="product-card-body">
          <div class="product-card-top">
            <span class="product-chip">Sản phẩm chính</span>
            <span class="product-code">#${escapeHtml(product.code)}</span>
          </div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || "Chưa có nội dung.")}</p>
          <div class="product-card-meta">
            <span>${escapeHtml(product.category || "Khác")}</span>
            <span>${childCount} sản phẩm con</span>
          </div>
          <button type="button" class="btn-buy">Xem chi tiết</button>
        </div>
      `;

      article.querySelector(".btn-buy").addEventListener("click", () => openProductModal(product.id));
      return article;
    }

    function renderProducts() {
      const products = getProducts();
      const keyword = (globalSearchInput.value || "").trim().toLowerCase();

      const filtered = products.filter((p) => {
        const matchCat =
          activeCategory === "all" ||
          (p.category || "").trim().toLowerCase() === activeCategory.toLowerCase();

        const matchSearch =
          !keyword ||
          (p.name || "").toLowerCase().includes(keyword) ||
          (p.code || "").toLowerCase().includes(keyword) ||
          (p.category || "").toLowerCase().includes(keyword);

        return matchCat && matchSearch;
      });

      productsGrid.innerHTML = "";

      if (!filtered.length) {
        emptyBox.style.display = "block";
        return;
      }

      emptyBox.style.display = "none";
      filtered.forEach((item) => {
        productsGrid.appendChild(createProductCard(item));
      });
    }

    function renderNoticeModal() {
      const notice = getNotice();
      const html = `
        <div class="rich-text">
          <strong>${escapeHtml(notice.title || defaultNotice.title)}</strong><br><br>
          ${nl2br(notice.content || defaultNotice.content)
            .replace("Ngô Nam", `<a href="${TELEGRAM_LINK}" target="_blank" rel="noopener noreferrer">Ngô Nam</a>`)}
        </div>
      `;
      noticeModalContent.innerHTML = html;
    }

    function maybeShowNoticeModal() {
      const hiddenUntil = Number(localStorage.getItem(KEYS.noticeHiddenUntil) || 0);
      if (Date.now() < hiddenUntil) {
        noticeModal.classList.remove("show");
      } else {
        noticeModal.classList.add("show");
      }
    }

    function openProductModal(parentId) {
      const parent = getProducts().find((p) => p.id === parentId);
      if (!parent) return;

      modalParentName.textContent = parent.name;
      modalParentDesc.textContent = parent.description || "Chưa có nội dung.";
      modalParentCode.textContent = parent.code;

      const children = Array.isArray(parent.children) ? parent.children : [];
      modalChildCount.textContent = `${children.length} mục`;
      modalChildList.innerHTML = "";

      if (!children.length) {
        const empty = document.createElement("div");
        empty.className = "child-empty";
        empty.textContent = "Chưa có sản phẩm con trong mục này.";
        modalChildList.appendChild(empty);
      } else {
        children.forEach((child) => {
          const card = document.createElement("div");
          card.className = "child-item";

          const imageHtml = child.image
            ? `<img src="${child.image}" alt="${escapeHtml(child.name)}" class="child-thumb" />`
            : `<div class="child-thumb-fallback">${escapeHtml(child.code)}</div>`;

          const oldPriceHtml = child.oldPrice
            ? `<span class="old-price">${formatCurrency(child.oldPrice)}</span>`
            : "";

          const badgeHtml = child.badge
            ? `<span class="discount-badge">${escapeHtml(child.badge)}</span>`
            : "";

          card.innerHTML = `
            <div class="child-image-wrap">
              ${imageHtml}
              ${badgeHtml}
            </div>
            <div class="child-content">
              <div class="child-title-row">
                <div class="child-title-col">
                  <strong>${escapeHtml(child.name)}</strong>
                  <span>#${escapeHtml(child.code)}</span>
                </div>
                <a
                  href="${buildChildPurchaseLink(parent, child)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="buy-now-small"
                >
                  Mua ngay
                </a>
              </div>
              <p>${escapeHtml(child.description || "Chưa có nội dung.")}</p>
              <div class="child-price-row">
                <strong class="current-price">${formatCurrency(child.price)}</strong>
                ${oldPriceHtml}
              </div>
              <div class="child-stock">Số lượng: <b>${escapeHtml(child.quantity || 0)}</b></div>
            </div>
          `;
          modalChildList.appendChild(card);
        });
      }

      productModal.classList.add("show");
      document.body.classList.add("modal-open");
    }

    function closeProductModal() {
      productModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }

    function renderEverything() {
      renderSite();
      renderPolicy();
      renderContact();
      renderParentSelect();
      renderCategories();
      renderProducts();
      renderNoticeModal();
      maybeShowNoticeModal();
    }

    function setAdminUi() {
      if (isAdmin) {
        adminSection.classList.remove("hidden");
      } else {
        adminSection.classList.add("hidden");
      }
    }

    function openApp(email) {
      currentUserEmail = email.trim().toLowerCase();
      isAdmin = currentUserEmail === ADMIN_EMAIL;
      localStorage.setItem(KEYS.session, currentUserEmail);

      loginScreen.classList.add("hidden");
      app.classList.remove("hidden");
      setAdminUi();
      renderEverything();
    }

    function logout() {
      localStorage.removeItem(KEYS.session);
      currentUserEmail = "";
      isAdmin = false;
      app.classList.add("hidden");
      loginScreen.classList.remove("hidden");
      emailInput.value = "";
      loginError.textContent = "";
      mobileDrawer.classList.add("hidden");
      mobileSearch.classList.add("hidden");
    }

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();

      if (!email) {
        loginError.textContent = "Vui lòng nhập Gmail.";
        return;
      }

      if (!isValidGmail(email)) {
        loginError.textContent = "Bạn phải nhập đúng định dạng ...@gmail.com";
        return;
      }

      loginError.textContent = "";
      openApp(email);
    });

    menuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("hidden");
      mobileSearch.classList.add("hidden");
    });

    openSearchBtn.addEventListener("click", () => {
      mobileSearch.classList.toggle("hidden");
      mobileDrawer.classList.add("hidden");
      if (!mobileSearch.classList.contains("hidden")) {
        globalSearchInput.focus();
      }
    });

    globalSearchInput.addEventListener("input", renderProducts);

    document.querySelectorAll(".drawer-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.add("hidden");
      });
    });

    logoutBtn.addEventListener("click", logout);
    logoutDesktop.addEventListener("click", logout);

    closeProductBtn.addEventListener("click", closeProductModal);
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });

    closeNoticeBtn.addEventListener("click", () => {
      noticeModal.classList.remove("show");
    });

    hideNoticeBtn.addEventListener("click", () => {
      const twoHours = 2 * 60 * 60 * 1000;
      localStorage.setItem(KEYS.noticeHiddenUntil, String(Date.now() + twoHours));
      noticeModal.classList.remove("show");
    });

    document.getElementById("siteForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      const title = document.getElementById("siteTitleInput").value.trim();
      const desc = document.getElementById("siteDescInput").value.trim();
      const imageFile = document.getElementById("bannerImageInput").files[0];
      const oldData = getSite();
      const image = imageFile ? await fileToBase64(imageFile) : oldData.bannerImage;

      setStorage(KEYS.site, {
        heroTitle: title || oldData.heroTitle || defaultSite.heroTitle,
        heroDesc: desc || oldData.heroDesc || defaultSite.heroDesc,
        bannerImage: image || ""
      });

      renderSite();
      alert("Đã lưu giao diện website.");
    });

    document.getElementById("parentForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      const name = document.getElementById("parentName").value.trim();
      const code = document.getElementById("parentCode").value.trim();
      const category = document.getElementById("parentCategory").value.trim();
      const desc = document.getElementById("parentDesc").value.trim();
      const imageFile = document.getElementById("parentImage").files[0];

      if (!name || !code) {
        alert("Vui lòng nhập tên và mã sản phẩm chính.");
        return;
      }

      const image = await fileToBase64(imageFile);
      const products = getProducts();

      products.unshift({
        id: createId("P"),
        name,
        code,
        category: category || "Khác",
        description: desc,
        image,
        children: []
      });

      setStorage(KEYS.products, products);
      e.target.reset();
      renderEverything();
      alert("Đã thêm sản phẩm chính.");
    });

    document.getElementById("childForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      const parentId = childParent.value;
      const name = document.getElementById("childName").value.trim();
      const code = document.getElementById("childCode").value.trim();
      const price = document.getElementById("childPrice").value.trim();
      const oldPrice = document.getElementById("childOldPrice").value.trim();
      const quantity = document.getElementById("childQty").value.trim();
      const badge = document.getElementById("childBadge").value.trim();
      const desc = document.getElementById("childDesc").value.trim();
      const imageFile = document.getElementById("childImage").files[0];

      if (!parentId || !name || !code || price === "") {
        alert("Vui lòng nhập đủ thông tin sản phẩm con.");
        return;
      }

      const products = getProducts();
      const parent = products.find((p) => p.id === parentId);

      if (!parent) {
        alert("Không tìm thấy sản phẩm chính.");
        return;
      }

      const image = await fileToBase64(imageFile);

      parent.children.unshift({
        id: createId("C"),
        name,
        code,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : 0,
        quantity: Number(quantity || 0),
        badge,
        description: desc,
        image
      });

      setStorage(KEYS.products, products);
      e.target.reset();
      renderEverything();
      alert("Đã thêm sản phẩm con.");
    });

    document.getElementById("noticeForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      const title = document.getElementById("noticeTitleInput").value.trim();
      const content = document.getElementById("noticeContentInput").value.trim();

      setStorage(KEYS.notice, {
        title: title || defaultNotice.title,
        content: content || defaultNotice.content
      });

      renderNoticeModal();
      alert("Đã lưu thông báo.");
    });

    document.getElementById("policyForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      const content = document.getElementById("policyContentInput").value.trim();
      const file = document.getElementById("policyBannerInput").files[0];
      const oldData = getPolicy();
      const image = file ? await fileToBase64(file) : oldData.bannerImage;

      setStorage(KEYS.policy, {
        bannerImage: image || "",
        content: content || oldData.content || defaultPolicy.content
      });

      renderPolicy();
      alert("Đã lưu chính sách.");
    });

    document.getElementById("contactForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isAdmin) return;

      setStorage(KEYS.contact, {
        address: document.getElementById("contactAddressInput").value.trim() || defaultContact.address,
        phone: document.getElementById("contactPhoneInput").value.trim() || defaultContact.phone,
        email: document.getElementById("contactEmailInput").value.trim() || defaultContact.email,
        desc: document.getElementById("contactDescInput").value.trim() || defaultContact.desc
      });

      renderContact();
      alert("Đã lưu thông tin liên hệ.");
    });

    document.getElementById("clearProductsBtn").addEventListener("click", () => {
      if (!isAdmin) return;
      const ok = confirm("Bạn có chắc muốn xoá toàn bộ sản phẩm?");
      if (!ok) return;

      setStorage(KEYS.products, []);
      renderEverything();
      alert("Đã xoá toàn bộ sản phẩm.");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeProductModal();
        noticeModal.classList.remove("show");
      }
    });

    (function init() {
      renderEverything();

      const savedSession = localStorage.getItem(KEYS.session);
      if (savedSession && isValidGmail(savedSession)) {
        openApp(savedSession);
      }
    })();
