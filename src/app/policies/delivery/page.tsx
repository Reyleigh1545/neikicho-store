import PolicyLayout from "../PolicyLayout";
import { formatVND, SHOP_CONFIG } from "@/config/shop";

export const metadata = { title: "Chính sách giao hàng | NekiCho" };

export default function DeliveryPolicyPage() {
  return (
    <PolicyLayout title="Chính sách giao hàng" active="/policies/delivery">
      <p>
        NekiCho là shop mới nên hiện chỉ giao trong <strong>nội thành Hà Nội</strong>. Chúng mình chưa giao đi tỉnh
        khác.
      </p>

      <h2>Thời gian giao</h2>
      <ul>
        <li>Phần lớn đơn có thể giao ngay trong ngày.</li>
        <li>Bạn có thể đặt trước và chọn ngày muốn nhận ở bước thanh toán. Chúng mình giao đúng ngày đó.</li>
        <li>
          Gần các dịp lễ (Giáng sinh, Tết) shop đông đơn nên có thể không giao trong ngày được. Với những dịp này, bạn
          nên đặt sớm.
        </li>
      </ul>

      <h2>Phí giao hàng</h2>
      <ul>
        <li>
          Nội thành Hà Nội: {formatVND(SHOP_CONFIG.defaultShippingFee)} mỗi đơn, hiện ngay trên trang sản phẩm và
          trong giỏ hàng.
        </li>
        <li>Miễn phí giao hàng cho đơn từ {formatVND(SHOP_CONFIG.freeShippingThreshold)}.</li>
      </ul>

      <h2>Đóng gói</h2>
      <ul>
        <li>Mọi món đều mới, còn nguyên tem.</li>
        <li>
          Quà được đặt trong hộp cứng NekiCho, lót giấy và xốp chống sốc. Món dễ vỡ (hũ nến thủy tinh, ly, bình) được
          bọc riêng.
        </li>
        <li>Hộp được cho vào túi giấy có quai trước khi giao.</li>
      </ul>
    </PolicyLayout>
  );
}
