import Link from "next/link";

// Registration is disabled: the test store must not collect emails or phone numbers.
export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
      <h1 className="text-2xl font-bold text-nekicho-text">Không cần tạo tài khoản</h1>
      <p className="text-sm text-nekicho-muted">
        Đây là store thử nghiệm của Student project – E-Business, Hanoi University. Bạn có thể đặt đơn thử
        ngay mà không cần đăng ký.
      </p>
      <Link
        href="/gift-sets"
        className="inline-block px-5 py-2.5 bg-nekicho-primary text-white rounded-full text-xs font-bold"
      >
        Xem 3 hộp quà
      </Link>
    </div>
  );
}
