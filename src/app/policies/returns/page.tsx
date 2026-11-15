import PolicyLayout from "../PolicyLayout";

export const metadata = { title: "Chính sách đổi trả | NekiCho" };

export default function ReturnsPolicyPage() {
  return (
    <PolicyLayout title="Chính sách đổi trả" active="/policies/returns">
      <p>
        Bạn nên <strong>kiểm tra hàng trước mặt người giao</strong>. Nếu mở hộp ra gặp một trong các trường hợp dưới
        đây, hãy liên hệ chúng mình để được đổi mới miễn phí.
      </p>

      <h2>Trường hợp được đổi mới</h2>
      <ul>
        <li>Giao sai món, sai màu hoặc sai mùi so với đơn.</li>
        <li>Hàng bị hỏng trong lúc vận chuyển (ví dụ hũ nến thủy tinh bị nứt, ly hoặc bình inox bị móp).</li>
        <li>Món nhận được khác rõ với mô tả trên trang sản phẩm.</li>
        <li>Lỗi từ nhà sản xuất (ví dụ khăn bị lỗi sợi, nắp ly không kín).</li>
      </ul>

      <h2>Cách gửi yêu cầu</h2>
      <ul>
        <li>Tốt nhất là quay video lúc mở hộp. Nếu không có video, ảnh chụp rõ chỗ lỗi cũng được.</li>
        <li>Gửi video hoặc ảnh qua tin nhắn fanpage NekiCho, kèm mã đơn.</li>
        <li>
          Trước khi giao, shop chụp ảnh từng hộp ở tình trạng nguyên vẹn để đối chiếu với ảnh bạn gửi.
        </li>
      </ul>

      <h2>Thời hạn</h2>
      <ul>
        <li>Nhận yêu cầu trong 48 giờ kể từ lúc bạn nhận hàng.</li>
        <li>Đổi 1 đổi 1 sang đúng món đó. Khi lỗi thuộc về shop, bạn không mất phí giao hàng.</li>
      </ul>
    </PolicyLayout>
  );
}
