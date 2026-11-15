/**
 * NekiCho catalog: the single source of truth for categories, products and box options.
 * Used by seed.js (fresh database) and sync-catalog.js (updates a live database WITHOUT deleting orders).
 */
const categoriesData = [
  { name: "Hộp quà theo người nhận", slug: "gift-sets", description: "3 hộp quà làm sẵn: chọn theo người nhận, giá 159.000 ₫ / 249.000 ₫ / 349.000 ₫.", imageKey: "gift-sets" },
  { name: "Ly giữ nhiệt", slug: "thermal-cups", description: "Ly giữ nhiệt inox 304 nắp bật, 350 ml.", imageKey: "thermal-cups" },
  { name: "Bình giữ nhiệt", slug: "thermal-bottles", description: "Bình giữ nhiệt inox 304 có quai xách, 500 ml.", imageKey: "thermal-bottles" },
  { name: "Nến thơm", slug: "scented-candles", description: "Nến thơm sáp đậu nành trong hũ thủy tinh, 4 mùi.", imageKey: "scented-candles" },
  { name: "Hoa sáp", slug: "wax-flowers", description: "Bó hoa hồng sáp mini, không cần tưới.", imageKey: "wax-flowers" },
  { name: "Khăn len", slug: "wool-scarves", description: "Khăn len tua rua, 2 màu đỏ đô và xanh rêu.", imageKey: "wool-scarves" },
  { name: "Tất cotton", slug: "socks", description: "Tất cotton cổ cao, đen hoặc trắng.", imageKey: "socks" },
];

// Common text blocks shown on every gift set page
const SET_INCLUDES =
  "Đi kèm mọi hộp: hộp cứng NekiCho màu hồng, giấy lót, thiệp in lời nhắn của bạn (viết ở bước thanh toán) và túi giấy.";
const SET_PRICE_RULE =
  "Cách tính giá: 1 món nhỏ (nến hoặc hoa sáp) 159.000 ₫ · 1 món dùng hằng ngày (ly, bình hoặc khăn) 249.000 ₫ · combo 2 món 349.000 ₫.";
const PHOTO_NOTE = "Ảnh là ảnh minh họa của concept, chưa phải ảnh chụp sản phẩm thật.";

const productsWithVariants = [
  // ---------- 3 READY-MADE GIFT SETS (main products) ----------
  {
    name: "Hộp Gửi Mẹ",
    slug: "hop-gui-me",
    description: [
      "Cho mẹ, bà và người thân trong gia đình. Mùa lạnh và Tết là lúc cần giữ ấm nhất, nên hộp này chỉ có 1–2 món mẹ dùng được cả mùa.",
      "Chọn 1 trong 3 mức: nến thơm (159.000 ₫), khăn len (249.000 ₫) hoặc khăn len + nến thơm (349.000 ₫).",
      "• Khăn len: sợi len pha mềm, có tua rua, khoảng 180 × 30 cm; màu đỏ đô hoặc xanh rêu.",
      "• Nến thơm: sáp đậu nành, bấc cotton, hũ thủy tinh 110 g, cháy khoảng 20 giờ.",
      SET_INCLUDES,
      SET_PRICE_RULE,
      PHOTO_NOTE,
    ].join("\n"),
    price: 159000,
    stock: 50,
    categorySlug: "gift-sets",
    imageKey: "set-scarves",
    isFeatured: true,
    boxCompatible: false,
    sizeUnits: 3,
    variants: [
      { name: "Nến thơm Cream (vani sữa)", scent: "Vani sữa", price: 159000, stock: 20, sku: "SET-ME-159-CRM" },
      { name: "Nến thơm Burgundy (hoa hồng & gỗ)", scent: "Hoa hồng & gỗ", price: 159000, stock: 20, sku: "SET-ME-159-BRG" },
      { name: "Khăn len đỏ đô", color: "Đỏ đô", price: 249000, stock: 20, sku: "SET-ME-249-RED" },
      { name: "Khăn len xanh rêu", color: "Xanh rêu", price: 249000, stock: 20, sku: "SET-ME-249-GRN" },
      { name: "Khăn len đỏ đô + Nến Burgundy", color: "Đỏ đô", scent: "Hoa hồng & gỗ", price: 349000, stock: 20, sku: "SET-ME-349-RED" },
      { name: "Khăn len xanh rêu + Nến Cream", color: "Xanh rêu", scent: "Vani sữa", price: 349000, stock: 20, sku: "SET-ME-349-GRN" },
    ],
  },
  {
    name: "Hộp Gửi Người Thương",
    slug: "hop-gui-nguoi-thuong",
    description: [
      "Cho người yêu, vợ hoặc chồng. Muốn tạo bất ngờ mà chưa rõ sở thích của người ấy? Hoa sáp để được lâu, ly giữ nhiệt thì dùng mỗi ngày.",
      "Chọn 1 trong 3 mức: bó hoa sáp (159.000 ₫), ly giữ nhiệt (249.000 ₫) hoặc hoa sáp + ly giữ nhiệt (349.000 ₫).",
      "• Bó hoa sáp: hoa hồng sáp mini nhiều màu, giấy gói đỏ đô viền vàng, cao khoảng 20 cm; không cần tưới.",
      "• Ly giữ nhiệt: inox 304 hai lớp, nắp bật có khóa, 350 ml, cao khoảng 18 cm; màu đỏ đô hoặc xanh rêu.",
      SET_INCLUDES,
      SET_PRICE_RULE,
      PHOTO_NOTE,
    ].join("\n"),
    price: 159000,
    stock: 50,
    categorySlug: "gift-sets",
    imageKey: "set-wax-flowers",
    isFeatured: true,
    boxCompatible: false,
    sizeUnits: 3,
    variants: [
      { name: "Bó hoa sáp", price: 159000, stock: 20, sku: "SET-NT-159-FLW" },
      { name: "Ly giữ nhiệt đỏ đô", color: "Đỏ đô", size: "350 ml", price: 249000, stock: 20, sku: "SET-NT-249-RED" },
      { name: "Ly giữ nhiệt xanh rêu", color: "Xanh rêu", size: "350 ml", price: 249000, stock: 20, sku: "SET-NT-249-GRN" },
      { name: "Bó hoa sáp + Ly đỏ đô", color: "Đỏ đô", price: 349000, stock: 20, sku: "SET-NT-349-RED" },
      { name: "Bó hoa sáp + Ly xanh rêu", color: "Xanh rêu", price: 349000, stock: 20, sku: "SET-NT-349-GRN" },
    ],
  },
  {
    name: "Hộp Gửi Bạn & Người Thân",
    slug: "hop-gui-ban-nguoi-than",
    description: [
      "Cho bạn thân, anh chị em, đồng nghiệp. Món quà vừa tầm: không quá đắt để người nhận ngại, cũng không quá rẻ để thiếu ý nghĩa.",
      "Chọn 1 trong 3 mức: nến thơm (159.000 ₫), bình giữ nhiệt (249.000 ₫) hoặc bình giữ nhiệt + nến thơm (349.000 ₫).",
      "• Bình giữ nhiệt: inox 304 hai lớp, có quai xách, 500 ml, cao khoảng 22 cm; màu đỏ đô hoặc xanh rêu.",
      "• Nến thơm: sáp đậu nành, bấc cotton, hũ thủy tinh 110 g, cháy khoảng 20 giờ; mùi Black (gỗ đàn hương) hoặc Forest Green (trà xanh & lá thông).",
      SET_INCLUDES,
      SET_PRICE_RULE,
      PHOTO_NOTE,
    ].join("\n"),
    price: 159000,
    stock: 50,
    categorySlug: "gift-sets",
    imageKey: "set-bottles",
    isFeatured: true,
    boxCompatible: false,
    sizeUnits: 3,
    variants: [
      { name: "Nến thơm Black (gỗ đàn hương)", scent: "Gỗ đàn hương", price: 159000, stock: 20, sku: "SET-BN-159-BLK" },
      { name: "Nến thơm Forest Green (trà xanh & lá thông)", scent: "Trà xanh & lá thông", price: 159000, stock: 20, sku: "SET-BN-159-GRN" },
      { name: "Bình giữ nhiệt đỏ đô", color: "Đỏ đô", size: "500 ml", price: 249000, stock: 20, sku: "SET-BN-249-RED" },
      { name: "Bình giữ nhiệt xanh rêu", color: "Xanh rêu", size: "500 ml", price: 249000, stock: 20, sku: "SET-BN-249-GRN" },
      { name: "Bình đỏ đô + Nến Black", color: "Đỏ đô", scent: "Gỗ đàn hương", price: 349000, stock: 20, sku: "SET-BN-349-RED" },
      { name: "Bình xanh rêu + Nến Forest Green", color: "Xanh rêu", scent: "Trà xanh & lá thông", price: 349000, stock: 20, sku: "SET-BN-349-GRN" },
    ],
  },

  // ---------- SINGLE ITEMS (also usable in the custom box builder) ----------
  {
    name: "Ly giữ nhiệt nắp bật 350 ml",
    slug: "ly-giu-nhiet-nap-bat-350ml",
    description: "Inox 304 hai lớp, nắp bật có khóa chống tràn, 350 ml, cao khoảng 18 cm, đường kính 6,5 cm. Vừa túi xách, giữ nóng hoặc lạnh.\n" + PHOTO_NOTE,
    price: 189000,
    stock: 40,
    categorySlug: "thermal-cups",
    imageKey: "set-cups",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1,
    variants: [
      { name: "Đỏ đô", color: "Đỏ đô", size: "350 ml", price: 189000, stock: 20, sku: "CUP-350-RED" },
      { name: "Xanh rêu", color: "Xanh rêu", size: "350 ml", price: 189000, stock: 20, sku: "CUP-350-GRN" },
    ],
  },
  {
    name: "Bình giữ nhiệt quai xách 500 ml",
    slug: "binh-giu-nhiet-quai-xach-500ml",
    description: "Inox 304 hai lớp, nắp vặn có quai cầm và dây xách, 500 ml, cao khoảng 22 cm.\n" + PHOTO_NOTE,
    price: 189000,
    stock: 40,
    categorySlug: "thermal-bottles",
    imageKey: "set-bottles",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1, // every item takes 1 slot (round 1: T9, T10)
    variants: [
      { name: "Đỏ đô", color: "Đỏ đô", size: "500 ml", price: 189000, stock: 20, sku: "BTL-500-RED" },
      { name: "Xanh rêu", color: "Xanh rêu", size: "500 ml", price: 189000, stock: 20, sku: "BTL-500-GRN" },
    ],
  },
  {
    name: "Nến thơm hũ thủy tinh 110 g",
    slug: "nen-thom-hu-thuy-tinh-110g",
    description: "Sáp đậu nành, bấc cotton, hũ thủy tinh 110 g, cháy khoảng 20 giờ. 4 mùi: Cream (vani sữa), Burgundy (hoa hồng & gỗ), Forest Green (trà xanh & lá thông), Black (gỗ đàn hương).\n" + PHOTO_NOTE,
    price: 99000,
    stock: 60,
    categorySlug: "scented-candles",
    imageKey: "set-candles",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1,
    variants: [
      { name: "Cream – vani sữa", scent: "Vani sữa", size: "110 g", price: 99000, stock: 15, sku: "CDL-CRM" },
      { name: "Burgundy – hoa hồng & gỗ", scent: "Hoa hồng & gỗ", size: "110 g", price: 99000, stock: 15, sku: "CDL-BRG" },
      { name: "Forest Green – trà xanh & lá thông", scent: "Trà xanh & lá thông", size: "110 g", price: 99000, stock: 15, sku: "CDL-GRN" },
      { name: "Black – gỗ đàn hương", scent: "Gỗ đàn hương", size: "110 g", price: 99000, stock: 15, sku: "CDL-BLK" },
    ],
  },
  {
    name: "Bó hoa hồng sáp mini",
    slug: "bo-hoa-hong-sap-mini",
    description: "Hoa hồng sáp mini nhiều màu (đỏ, hồng, kem) kèm hoa khô, giấy gói đỏ đô viền vàng, cao khoảng 20 cm. Không cần tưới.\n" + PHOTO_NOTE,
    price: 99000,
    stock: 40,
    categorySlug: "wax-flowers",
    imageKey: "set-wax-flowers",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1,
    variants: [
      { name: "Giấy gói đỏ đô", color: "Đỏ đô", price: 99000, stock: 40, sku: "FLW-RED" },
    ],
  },
  {
    name: "Khăn len tua rua",
    slug: "khan-len-tua-rua",
    description: "Sợi len pha mềm, dệt trơn, có tua rua hai đầu, khoảng 180 × 30 cm.\n" + PHOTO_NOTE,
    price: 189000,
    stock: 40,
    categorySlug: "wool-scarves",
    imageKey: "set-scarves",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1, // every item takes 1 slot (round 1: T9, T10)
    variants: [
      { name: "Đỏ đô", color: "Đỏ đô", size: "180 × 30 cm", price: 189000, stock: 20, sku: "SCF-RED" },
      { name: "Xanh rêu", color: "Xanh rêu", size: "180 × 30 cm", price: 189000, stock: 20, sku: "SCF-GRN" },
    ],
  },
  {
    name: "Tất cotton cổ cao (1 đôi)",
    slug: "tat-cotton-co-cao",
    description: "Cotton dệt gân, cổ cao, freesize 35–42. Món thêm nhỏ để bỏ vào hộp tự chọn.\n" + PHOTO_NOTE,
    price: 49000,
    stock: 60,
    categorySlug: "socks",
    imageKey: "set-socks",
    isFeatured: false,
    boxCompatible: true,
    sizeUnits: 1,
    variants: [
      { name: "Đen", color: "Đen", size: "Freesize 35–42", price: 49000, stock: 30, sku: "SCK-BLK" },
      { name: "Trắng", color: "Trắng", size: "Freesize 35–42", price: 49000, stock: 30, sku: "SCK-WHT" },
    ],
  },
];

const boxOptionsData = [
  { type: "BOX", name: "Hộp NekiCho tiêu chuẩn", slug: "hop-nekicho-tieu-chuan", price: 60000, imageKey: "box-closed", colorHex: "#F7C9D9", maxCapacity: 3 },
  { type: "BOX", name: "Hộp NekiCho cỡ lớn", slug: "hop-nekicho-co-lon", price: 75000, imageKey: "box-open-empty", colorHex: "#F39ABD", maxCapacity: 5 },
  { type: "RIBBON", name: "Ruy băng kem", slug: "ruy-bang-kem", price: 0, colorHex: "#EFE3CC" },
  { type: "RIBBON", name: "Ruy băng đỏ đô", slug: "ruy-bang-do-do", price: 10000, colorHex: "#7A1F35" },
  { type: "CARD", name: "Thiệp NekiCho (in lời nhắn)", slug: "thiep-nekicho", price: 0 },
  { type: "CARD", name: "Thiệp Giáng sinh & Năm mới", slug: "thiep-giang-sinh-nam-moi", price: 0 },
];

module.exports = { categoriesData, productsWithVariants, boxOptionsData };
