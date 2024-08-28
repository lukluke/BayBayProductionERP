"use client";
import Menu from "@/ui/icons/menu";
import { ReactNode, useState } from "react";
import Link from "next/link";
import SIDE_BAR_ROUTES from "@/constants/sidebar";
import * as Accordion from "@radix-ui/react-accordion";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

export default function NavigationHandler({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="h-full flex flex-col max-h-dvh">
      <div className="w-full z-50 flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-gradient-to-b from-blue-100 to-blue-200">
        <h1 className="text-xl md:text-2xl font-bold">
          <Link href={"/"}>企業資源規劃系統</Link>
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <div
            className="w-8 p-1 cursor-pointer"
            onClick={() => setOpen((cur) => !cur)}
          >
            <Menu />
          </div>
          <div
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="cursor-pointer"
          >
            登出
          </div>
        </div>
      </div>
      <main className="flex flex-1 overflow-auto">
        <nav
          className={`h-full flex-col md:w-1/6 max-w-24 md:max-w-28 border-r custom-scrollbar overflow-y-scroll ${
            open ? "flex" : "hidden"
          }`}
        >
          {/* className="p-4 text-xs md:text-sm hover:text-highlight border-b" */}
          <Accordion.Root type="single" collapsible>
            {SIDE_BAR_ROUTES.filter((route) =>
              route.role.includes(user.role)
            ).map((route, index) => {
              return route.subRoutes.length > 0 ? (
                <Accordion.Item
                  key={`route-${index}`}
                  value={`route-${index}`}
                  className="text-xs md:text-sm AccordionItem text-center"
                >
                  <Accordion.Trigger className="p-4 w-full hover:text-highlight border-b cursor-zoom-in">
                    <div className="p-2">{route.icon}</div>
                    <div className="text-center">{route.name}</div>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    {route.subRoutes.map((subRoute, subIndex) => {
                      return (
                        <Link
                          key={`route-${index}-${subIndex}`}
                          href={subRoute.path}
                        >
                          <div className="text-center hover:text-highlight hover:bg-slate-50 py-2 border-b">
                            {subRoute.name}
                          </div>
                        </Link>
                      );
                    })}
                  </Accordion.Content>
                </Accordion.Item>
              ) : (
                <Accordion.Item
                  key={`route-${index}`}
                  value={`route-${index}`}
                  className="text-xs md:text-sm border-b AccordionItem"
                >
                  <Link key={index} href={route.path}>
                    <Accordion.Trigger className="p-4 w-full hover:text-highlight border-b">
                      <div className="p-2">{route.icon}</div>
                      <div className="text-center">{route.name}</div>
                    </Accordion.Trigger>
                  </Link>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </nav>
        {children}
      </main>
    </div>
  );
}
