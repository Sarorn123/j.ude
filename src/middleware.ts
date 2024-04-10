import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(async function middleware(req: Request & { kindeAuth: any }) {
});

export const config = {
  matcher: ["/services/:path*"],
};