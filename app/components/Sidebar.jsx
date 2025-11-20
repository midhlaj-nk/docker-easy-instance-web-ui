"use client";
import { usePathname } from "next/navigation";
import { useInstancesStore } from "@/lib/store";

function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { selectedInstance } = useInstancesStore();

  const navLinks = [
    {
      href: "/dashboard",
      label: "My Droplets",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.223a1 1 0 0 1 1.228 0l8 6.223a1 1 0 0 1 .386.79zm-2-1V9.978l-7-5.444l-7 5.444V19z"
          />
        </svg>
      ),
    },
    {
      href: "/metrics",
      label: "Metrics Panel",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 56 56"
        >
          <path
            fill="currentColor"
            d="m45.8 32.972l-2.087 7.544c-.768 2.775-3.749 3.145-5.196.67l-7.409-12.671l-6.47 10.004c-1.385 2.14-4.138 2.154-5.537.02l-2.954-4.51l-1.353 1.387c-1.15 1.18-2.99 1.657-4.595 1.273v5.432c0 2.438 1.313 3.68 3.656 3.68h28.313c2.32 0 3.633-1.242 3.633-3.68zm0-15V13.88c0-2.438-1.312-3.68-3.632-3.68H13.855c-2.343 0-3.656 1.242-3.656 3.68v18.47l.86.424c.213.104.705.02.872-.151l1.696-1.74c1.664-1.707 4.29-1.452 5.596.542l2.636 4.023l6.568-10.154c1.41-2.18 4.193-2.12 5.504.123l6.659 11.388zM13.786 49.575c-4.875 0-7.36-2.414-7.36-7.265V13.69c0-4.851 2.485-7.265 7.36-7.265h28.453c4.899 0 7.336 2.437 7.336 7.265v28.62c0 4.828-2.437 7.265-7.336 7.265z"
          />
        </svg>
      ),
    },
    {
      href: "/resource-monitor",
      label: "Resource Monitor",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 20H9m-5-6.2V8.2c0-1.12 0-1.68.218-2.108c.192-.377.497-.682.874-.874C5.52 5 6.08 5 7.2 5h9.6c1.12 0 1.68 0 2.107.218c.377.192.683.497.875.874c.218.427.218.987.218 2.105v5.606c0 1.118 0 1.677-.218 2.104a2 2 0 0 1-.875.875c-.427.218-.986.218-2.104.218H7.197c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.875C4 15.48 4 14.92 4 13.8"
          />
        </svg>
      ),
    },
    {
      href: "/git-manager",
      label: "Git Manager",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path d="M8 6a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m13 12a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0M8 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" />
            <path
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="2"
              d="M18.5 15.5v-1a3 3 0 0 0-3-3h-7a3 3 0 0 1-3-3m13 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Zm-13-7a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Zm0 .5v6M8 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z"
            />
          </g>
        </svg>
      ),
    },
    {
      href: "/logs",
      label: "Logs",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5zM8 12h8v2H8zm0 4h8v2H8z"
          />
        </svg>
      ),
    },
    {
      href: "/backup",
      label: "Backup",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path
              d="M1 14.5A5.5 5.5 0 0 0 6.5 20h11a5.5 5.5 0 0 0 .987-10.912a6.5 6.5 0 0 0-12.974 0A5.5 5.5 0 0 0 1 14.5"
              clipRule="evenodd"
            />
            <path
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="2"
              d="M1 14.5A5.5 5.5 0 0 0 6.5 20h11a5.5 5.5 0 0 0 .987-10.912a6.5 6.5 0 0 0-12.974 0A5.5 5.5 0 0 0 1 14.5Z"
              clipRule="evenodd"
            />
            <path
              stroke="currentColor"
              strokeLinecap="square"
              strokeWidth="2"
              d="m15 11.5l-3-3l-3 3m3 4.5v-3m0 0V9z"
            />
          </g>
        </svg>
      ),
    },
    {
      href: "/shell",
      label: "Shell",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 14 14"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.497 11.5v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1m.278-7.649a2.5 2.5 0 0 0-3.572 3.147q-.187.241-.345.47c-.572.829-.202 1.898.678 2.388l2.96 1.644h5.047l2.924-1.642c.875-.49 1.242-1.557.672-2.383a10 10 0 0 0-.35-.477a2.5 2.5 0 0 0-3.572-3.147a2.5 2.5 0 0 0-4.442 0M8.497 7l.724-3.154m3.625 3.014L9.996 9M5.497 7l-.725-3.154M1.147 6.86L3.997 9"
            strokeWidth="1"
          />
        </svg>
      ),
    },
    {
      href: "/subscriptions",
      label: "Subscriptions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m12 5.75l-3.614 6L3 8.25l1.5 10h15l1.5-10l-5.386 3.5Z"
          />
        </svg>
      ),
    },
    {
      href: "/domain-management",
      label: "Domain Management",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
      ),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <circle
              cx="12"
              cy="12"
              r="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              fill="currentColor"
              d="m5.399 5.88l.375-.65a.75.75 0 0 0-.925.14zM3.4 9.344l-.717-.222a.75.75 0 0 0 .342.871zm-.002 5.311l-.375-.65a.75.75 0 0 0-.341.872zm2 3.464l-.55.51a.75.75 0 0 0 .925.14zm4.6 2.655h-.75c0 .35.243.653.584.731zm4.001.002l.167.732a.75.75 0 0 0 .583-.732zM18.6 18.12l-.375.65a.75.75 0 0 0 .925-.14zm1.998-3.466l.717.222a.75.75 0 0 0-.342-.871zm.002-5.311l.375.65a.75.75 0 0 0 .341-.872zm-2-3.465l.55-.509a.75.75 0 0 0-.925-.14zM14 3.225h.75a.75.75 0 0 0-.583-.731zm-4-.002l-.167-.732a.75.75 0 0 0-.583.732zm4 1.849h-.75zm5 8.66l-.375.65zm-2 3.464l-.375.65zM5 13.732l.375.65zm2-6.928l-.375.65zM4.117 9.566a8.24 8.24 0 0 1 1.831-3.177l-1.1-1.02a9.74 9.74 0 0 0-2.164 3.754zm.738 6.559a8.3 8.3 0 0 1-.74-1.69l-1.432.443a9.8 9.8 0 0 0 .873 1.997zm1.094 1.486a8.3 8.3 0 0 1-1.094-1.486l-1.299.75a9.8 9.8 0 0 0 1.292 1.755zm7.884 2.435a8.24 8.24 0 0 1-3.666-.002l-.334 1.462a9.74 9.74 0 0 0 4.334.003zm6.05-5.612a8.24 8.24 0 0 1-1.831 3.177l1.1 1.02a9.74 9.74 0 0 0 2.164-3.754zm-.738-6.559q.471.823.74 1.69l1.432-.443a9.8 9.8 0 0 0-.873-1.997zM18.05 6.389c.41.443.778.94 1.094 1.486l1.299-.75A9.8 9.8 0 0 0 19.15 5.37zm-7.884-2.435a8.24 8.24 0 0 1 3.666.002l.334-1.462a9.74 9.74 0 0 0-4.334-.003zm.583 1.118v-1.85h-1.5v1.85zM7.375 6.154L5.774 5.23l-.75 1.299l1.6.924zm-2.75 6.929l-1.601.924l.75 1.299l1.6-.924zm.75-3.465l-1.6-.923l-.75 1.3l1.6.923zm5.375 11.157v-1.847h-1.5v1.847zm-4.125-4.228l-1.601.924l.75 1.3l1.6-.925zm12.351.924l-1.601-.924l-.75 1.299l1.601.924zm-4.226 3.306v-1.849h-1.5v1.85zm5.476-12.083l-1.601.924l.75 1.3l1.601-.925zm.748 5.312l-1.599-.924l-.75 1.3l1.6.923zM14.75 5.072V3.225h-1.5v1.847zm3.476.158l-1.601.924l.75 1.3l1.601-.925zm-4.976-.158c0 2.117 2.292 3.44 4.125 2.381l-.75-1.299a1.25 1.25 0 0 1-1.875-1.082zm5.375 4.546c-1.833 1.059-1.833 3.705 0 4.764l.75-1.3a1.25 1.25 0 0 1 0-2.165zm-1.25 6.929c-1.833-1.059-4.125.264-4.125 2.381h1.5a1.25 1.25 0 0 1 1.875-1.082zm-6.625 2.381c0-2.117-2.292-3.44-4.125-2.381l.75 1.299a1.25 1.25 0 0 1 1.875 1.082zm-5.375-4.546c1.833-1.059 1.833-3.705 0-4.764l-.75 1.3a1.25 1.25 0 0 1 0 2.165zm3.875-9.31a1.25 1.25 0 0 1-1.875 1.082l-.75 1.3c1.833 1.058 4.125-.265 4.125-2.382z"
            />
          </g>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed z-40 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <aside
          className="w-68 h-full border-r transition-colors duration-300 pt-16"
          style={{
            backgroundColor: "var(--sidebar-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="p-6">
            <h1
              className="text-xl font-bold mb-4 capitalize"
              style={{ color: "var(--text-color)" }}
            >
              {selectedInstance?.name || "Easy Instance"}
            </h1>
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-[var(--text-color)] hover:bg-[var(--primary-color)] hover:text-white"
                    }`}
                  >
                    {link.icon && (
                      <span className="text-lg flex-shrink-0">{link.icon}</span>
                    )}
                    <span className="font-medium text-[14px]">
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
