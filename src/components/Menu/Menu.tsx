"use client";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; 
import ReusableModal from '../Modals/ModalOne';
import { useUser } from '@/context/UserContext';
import styles from './Menu.module.css';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/home",
        visible: ["admin", "user", "operation"],
      },
      {
        icon: "/motorbike.png",
        label: "Rider",
        href: "/riders",
        visible: ["admin", "user", "operation"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "#",
        visible: ["admin", "user", "operation"],
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const { user , logout } = useUser();
  const role = user?.role || "admin";

  const handleLogout = () => {
    console.log("User logged out");
    logout();
    setIsModalOpen(false); // Close the modal after logout
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open the modal on logout click
  };

  const actions = [
    {
      label: "Cancel",
      onClick: () => setIsModalOpen(false), // Close the modal without action
      isCancel: true,
    },
    {
      label: "Logout",
      onClick: handleLogout, // Perform logout
    },
  ];

  return (
    <div className={styles.menuContainer}>
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className={`${styles.menuTitle} ${i.title === "OTHER" ? "mt-6" : ""}`}>
            {i.title}
          </span>
          {i.items.map((item) => {
            const isActive = pathname.startsWith(item.href);

            if (item.visible.includes(role)) {
              return (
                item.label === "Logout" ? (
                  <button
                    key={item.label}
                    onClick={handleLogoutClick} // Trigger the modal
                    className={`${styles.menuButton} ${isActive ? styles.menuButtonActive : ''} ${styles.logoutButton}`}
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              );
            }
            return null;
          })}
        </div>
      ))}

      {/* Modal for Logout */}
      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        title="Confirm Logout"
        actions={actions}
      >
        <p>Are you sure you want to log out?</p>
      </ReusableModal>
    </div>
  );
};

export default Menu;
