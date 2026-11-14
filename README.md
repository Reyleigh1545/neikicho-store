# NekiCho – Store thử nghiệm

**Student project – E-Business, Hanoi University.** NekiCho là sản phẩm concept, không bán thật. Checkout chỉ chạy test mode: không thu tiền, không giao hàng, không hỏi số điện thoại hay email.

Next.js 14 · TypeScript · Tailwind · Prisma · PostgreSQL (Neon) · host trên Vercel.

## 1. Đưa store lên mạng (Vercel + Neon, miễn phí, khoảng 20 phút)

Store cần một database online để lưu đơn thử. Dùng **Neon** (Postgres miễn phí) và **Vercel** (host miễn phí).

**Bước 1 – Tạo database trên Neon**
1. Vào neon.tech, đăng ký (có thể đăng nhập bằng GitHub hoặc Google).
2. Tạo project mới, region chọn **AWS US East (N. Virginia)** cho cùng khu vực với Vercel, để checkout không bị chậm.
3. Bấm **Connect**, copy chuỗi kết nối bắt đầu bằng `postgresql://…`. Chọn bản **không** có chữ `-pooler` trong tên host.

**Bước 2 – Đưa code lên GitHub**
1. Tạo một repo **private** trên GitHub.
2. Upload toàn bộ thư mục này (trừ `node_modules`), hoặc dùng `git push`.

**Bước 3 – Deploy trên Vercel**
1. Vào vercel.com, đăng nhập bằng GitHub, chọn **Add New → Project**, import repo vừa tạo.
2. Trước khi bấm Deploy, mở **Environment Variables** và thêm 2 biến:
   - `DATABASE_URL` = chuỗi kết nối Neon ở bước 1
   - `ADMIN_PASSWORD` = mật khẩu admin của nhóm (đừng dùng `admin123`)
3. Bấm **Deploy**. Lần build đầu tự tạo bảng và nạp 3 hộp quà, 6 món lẻ, tài khoản admin. Những lần deploy sau **không** xoá đơn thử.
4. Vercel trả về link dạng `https://ten-project.vercel.app`. Gửi link này cho tester.

**Bước 4 – Kiểm tra trước khi gọi tester**
- Mở link trên điện thoại, đặt thử 1 đơn bằng tên và địa chỉ giả.
- Đăng nhập `/auth/login` bằng `admin@nekicho.com` và `ADMIN_PASSWORD`, vào `/admin` xem đơn đó đã hiện chưa.

Sửa code xong thì push lên GitHub, Vercel sẽ tự deploy lại sau khoảng 1–2 phút. Đây là cách sửa lỗi giữa vòng 1 và vòng 2.

## 2. Chạy trên máy (không bắt buộc)

```bash
cp .env.example .env     # điền DATABASE_URL (có thể dùng chung database Neon) và ADMIN_PASSWORD
npm install
npx prisma db push       # tạo bảng
npm run db:seed          # nạp dữ liệu; XOÁ hết đơn cũ
npm run dev              # http://localhost:3000
```

**Cẩn thận:** `npm run db:seed` xoá toàn bộ đơn thử trong database đang dùng. Không chạy lệnh này vào database online khi đang có đơn test thật.

## 3. Tài khoản của nhóm

- Trang quản lý: `/admin`, chỉ hiện khi đăng nhập bằng `admin@nekicho.com` với mật khẩu là `ADMIN_PASSWORD`. Trang đăng nhập ở `/auth/login`, không có link trên store.
- Khách không cần (và không thể) tạo tài khoản. Đăng nhập nhanh "Demo Access" đã bị tắt.
- Mỗi đơn thử có thời gian đặt. Dùng thời gian này để đối chiếu với dòng T trong workbook.

## 4. Sản phẩm

| Loại | Sản phẩm | Giá |
| --- | --- | --- |
| Hộp làm sẵn | Hộp Gửi Mẹ, Hộp Gửi Người Thương, Hộp Gửi Bạn & Người Thân | 159.000 ₫ (1 món nhỏ) / 249.000 ₫ (1 món dùng hằng ngày) / 349.000 ₫ (combo 2 món) |
| Món lẻ | Ly giữ nhiệt 350 ml, bình giữ nhiệt 500 ml, khăn len | 189.000 ₫ |
| Món lẻ | Nến thơm 110 g (4 mùi), bó hoa hồng sáp mini | 99.000 ₫ |
| Món lẻ | Tất cotton | 49.000 ₫ |
| Tự ghép hộp | Hộp tiêu chuẩn 60.000 ₫ (3 chỗ), hộp lớn 75.000 ₫ (5 chỗ) + giá từng món | Cùng cách tính với hộp làm sẵn: giá món + 60.000 ₫ hộp, giấy lót, thiệp |

Phí giao 30.000 ₫ nội thành Hà Nội, miễn phí từ 500.000 ₫ (`src/config/shop.ts`). Mọi ảnh trong `public/images/products/` là ảnh minh họa tạo bằng AI.

Sản phẩm, giá và mô tả nằm trong `prisma/seed.js`, chỉ được nạp vào database **một lần** ở lần deploy đầu. Nếu sửa sau đó, phải chạy `npm run db:seed` vào database online, và lệnh này xoá hết đơn cũ. Vì vậy hãy chốt sản phẩm trước vòng 1. Ảnh sửa ở `src/config/images.ts` và áp dụng ngay khi deploy lại.

## 5. Trang chính

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ, 3 hộp quà, món lẻ |
| `/shop` | Tất cả sản phẩm, lọc theo danh mục |
| `/products/[slug]` | Chọn món/màu/mùi, thông tin giao hàng và đổi trả |
| `/custom-box` | Tự ghép hộp 5 bước |
| `/checkout` | Checkout test mode: tên và địa chỉ giả, ngày nhận, lời nhắn thiệp |
| `/orders/[mã]` | Xác nhận đơn thử |
| `/policies/delivery`, `/returns`, `/privacy` | 3 trang chính sách |
| `/admin` | Quản lý đơn thử (chỉ nhóm) |

## 6. Phân công

Ghi đúng ai đã làm phần nào ở đây và trong report (giảng viên sẽ hỏi trong Q&A).

| Thành viên | Phần đã làm |
| --- | --- |
| | |
