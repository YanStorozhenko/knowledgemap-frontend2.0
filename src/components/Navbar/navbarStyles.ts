// src/components/Navbar/navbarStyles.ts

export const linkStyle = "text-sm font-medium text-primary hover:text-secondary";
export const logoLinkStyle = "flex items-center gap-2";
export const mobileLinkStyle = "block py-2 text-sm text-primary hover:text-secondary";
export const navContainerStyle = "hidden md:flex gap-4 items-center";
export const burgerButtonStyle = "md:hidden text-2xl text-primary ml-4";
export const desktopUserPanelStyle = "hidden md:block";
export const mobileNavStyle = "md:hidden flex flex-col gap-2 p-4 bg-base-200 rounded-lg mt-2";
export const headerContainerStyle = "flex items-center justify-between px-4 py-2";
export const headerWrapperStyle = "bg-base-100 shadow";
export const titleStyle = "text-lg font-bold text-primary";
export const logoutButtonStyle = "btn btn-sm bg-blue hover:bg-pink-500 text-white";

// 🔧 Нові стилі для адаптивного блоку користувача
export const userInfoTextStyle = "text-xs sm:text-sm leading-tight text-right whitespace-nowrap truncate max-w-[150px]";
export const userInfoWrapperStyle =
    "flex items-center gap-2 text-sm whitespace-nowrap max-w-xs truncate flex-col sm:flex-row sm:items-center";
