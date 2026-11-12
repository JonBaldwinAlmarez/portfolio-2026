/*
This keeps every admin page out of search engines. Because of the title template, 
change your login page’s title from "Admin login" to "Login", so it doesn’t read “Admin login | Admin”.
*/

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
