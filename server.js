const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? { rejectUnauthorized: false }
    : false,
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      category TEXT DEFAULT 'Khác',
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS child_products (
      id TEXT PRIMARY KEY,
      parent_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      code TEXT NOT NULL,
      price NUMERIC DEFAULT 0,
      old_price NUMERIC DEFAULT 0,
      quantity INTEGER DEFAULT 0,
      badge TEXT DEFAULT '',
      description TEXT DEFAULT '',
      image TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const defaults = [
    [
      "notice",
      {
        title: "Chào mừng bạn đến với Bằng AI Tool Shop",
        content:
          'Dưới đây là vài lưu ý quan trọng trước khi mua hàng:\\n\\nBảo hành rõ ràng trong quá trình sử dụng\\n\\nKhông chia sẻ thông tin: vui lòng không đổi email/mật khẩu nếu gói bạn mua là "dùng chung" (nếu là "tài khoản riêng" thì sẽ có hướng dẫn riêng).\\n\\nCần hỗ trợ nhanh? Nhắn Zalo/Inbox để được xử lý\\n\\nLiên hệ hỗ trợ (Zalo): 0399834208\\nLiên hệ hỗ trợ 2 (Telegram): Ngô Nam\\nThời gian hỗ trợ: 9:00 - 22:00 (mỗi ngày)'
      }
    ],
    [
      "site",
      {
        heroTitle: "Kho sản phẩm AI Tool mobile-first",
        heroDesc:
          "Giao diện gọn đẹp, dễ nhìn trên điện thoại, khách xem sản phẩm nhanh, admin chủ động thêm sản phẩm và nội dung.",
        bannerImage: ""
      }
    ],
    [
      "policy",
      {
        bannerImage: "",
        content:
          "1) Giới thiệu\\n\\nBằng AI Tool Shop cam kết tôn trọng và bảo vệ thông tin của khách hàng.\\n\\n2) Quy định sử dụng\\n\\nVui lòng sử dụng sản phẩm đúng mục đích.\\n\\n3) Hỗ trợ\\n\\nNếu gặp vấn đề, vui lòng liên hệ để được xử lý nhanh."
      }
    ],
    [
      "contact",
      {
        address: "Việt Nam",
        phone: "0399834208",
        email: "bangnguyen02@gmail.com",
        desc: "Bằng AI Tool Shop - Website trưng bày sản phẩm AI Tool."
      }
    ]
  ];

  for (const [key, value] of defaults) {
    await pool.query(
      `
      INSERT INTO site_content(key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO NOTHING
      `,
      [key, JSON.stringify(value)]
    );
  }
}

function mapProducts(rows, childRows) {
  return rows.map((p) => ({
    ...p,
    children: childRows.filter((c) => c.parent_id === p.id).map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      price: Number(c.price || 0),
      oldPrice: Number(c.old_price || 0),
      quantity: Number(c.quantity || 0),
      badge: c.badge || "",
      description: c.description || "",
      image: c.image || ""
    }))
  }));
}

app.get("/api/bootstrap", async (req, res) => {
  try {
    const contentResult = await pool.query(`SELECT key, value FROM site_content`);
    const productResult = await pool.query(
      `SELECT * FROM products ORDER BY created_at DESC`
    );
    const childResult = await pool.query(
      `SELECT * FROM child_products ORDER BY created_at DESC`
    );

    const content = {};
    for (const row of contentResult.rows) {
      content[row.key] = row.value;
    }

    const products = mapProducts(productResult.rows, childResult.rows);

    res.json({
      ok: true,
      site: content.site || {},
      notice: content.notice || {},
      policy: content.policy || {},
      contact: content.contact || {},
      products
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { id, name, code, category, description, image } = req.body;

    await pool.query(
      `
      INSERT INTO products (id, name, code, category, description, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [id, name, code, category || "Khác", description || "", image || ""]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/child-products", async (req, res) => {
  try {
    const {
      id,
      parentId,
      name,
      code,
      price,
      oldPrice,
      quantity,
      badge,
      description,
      image
    } = req.body;

    await pool.query(
      `
      INSERT INTO child_products
      (id, parent_id, name, code, price, old_price, quantity, badge, description, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        id,
        parentId,
        name,
        code,
        Number(price || 0),
        Number(oldPrice || 0),
        Number(quantity || 0),
        badge || "",
        description || "",
        image || ""
      ]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/content/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const allowed = ["site", "notice", "policy", "contact"];

    if (!allowed.includes(key)) {
      return res.status(400).json({ ok: false, error: "Invalid key" });
    }

    await pool.query(
      `
      INSERT INTO site_content(key, value)
      VALUES ($1, $2)
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value
      `,
      [key, JSON.stringify(req.body)]
    );

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.delete("/api/products", async (req, res) => {
  try {
    await pool.query(`DELETE FROM child_products`);
    await pool.query(`DELETE FROM products`);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB init failed:", err);
    process.exit(1);
  });
