import PolicyLayout from "../PolicyLayout";

export const metadata = { title: "Quyền riêng tư | NekiCho" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Chính sách quyền riêng tư" active="/policies/privacy">
      <h2>Trong giai đoạn thử nghiệm (hiện tại)</h2>
      <ul>
        <li>Store không hỏi số điện thoại, email hay thông tin ngân hàng.</li>
        <li>Không cần tạo tài khoản để đặt đơn thử.</li>
        <li>
          Khi đặt đơn thử, bạn chỉ nhập tên và địa chỉ <strong>giả</strong>. Đơn thử chỉ nhóm dự án xem được và sẽ bị xoá
          sau khi kết thúc môn học.
        </li>
      </ul>

      <h2>Khi store ra mắt thật</h2>
      <ul>
        <li>
          Để giao quà, chúng mình cần tên, số điện thoại và địa chỉ người nhận. Chúng mình không bao giờ hỏi mật khẩu
          ngân hàng hay số thẻ.
        </li>
        <li>
          Thông tin chỉ dùng để xác nhận, chuẩn bị và giao đơn. Chúng mình không bán và không chia sẻ cho ai khác, trừ
          người giao hàng cần địa chỉ và số điện thoại người nhận.
        </li>
        <li>Bạn có thể yêu cầu sửa hoặc xoá thông tin qua fanpage. Dữ liệu đơn hàng được lưu 1 tháng rồi xoá.</li>
      </ul>
    </PolicyLayout>
  );
}
