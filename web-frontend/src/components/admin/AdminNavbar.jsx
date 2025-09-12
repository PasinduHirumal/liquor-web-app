import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    useMediaQuery,
    useTheme,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Badge,
    Slide,
    Fade,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
    ExpandMore,
    ExpandLess,
} from "@mui/icons-material";
import useAdminAuthStore from "../../stores/adminAuthStore";
import { getPendingOrdersCount } from "../../lib/orderApi";
import ConfirmLogoutDialog from "../../common/ConfirmLogoutDialog";

const StyledNavLink = ({ to, children, onClick, className = "" }) => (
    <NavLink
        to={to}
        onClick={onClick}
        style={{ textDecoration: "none" }}
        className={({ isActive }) =>
            `px-3 py-2 rounded transition font-medium text-white ${isActive ? "bg-[#490101] font-bold" : "hover:bg-[#5f0404]"
            } ${className}`
        }
    >
        {children}
    </NavLink>
);


const AdminNavbar = () => {
    const navigate = useNavigate();
    const logout = useAdminAuthStore((s) => s.logout);
    const user = useAdminAuthStore((s) => s.user);
    const isSuperAdmin =
        user?.role === "super_admin" || user?.roles?.includes("super_admin");

    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:1150px)");

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [manageDropDownOpen, setManageDropDownOpen] = useState(false);
    const [storeDropDownOpen, setStoreDropDownOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const manageDropdownRef = useRef(null);
    const storeDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                setPendingCount(await getPendingOrdersCount());
            } catch (err) {
                console.error("Failed to fetch pending orders count:", err);
            }
        };
        fetchPending();
        const interval = setInterval(fetchPending, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                manageDropdownRef.current &&
                !manageDropdownRef.current.contains(e.target)
            )
                setManageDropDownOpen(false);
            if (
                storeDropdownRef.current &&
                !storeDropdownRef.current.contains(e.target)
            )
                setStoreDropDownOpen(false);
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target) &&
                !e.target.closest('[aria-label="menu"]')
            )
                setMobileMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const confirmed = await ConfirmLogoutDialog({
            title: "Confirm Logout",
            html: "Are you sure you want to log out?",
            icon: "warning",
        });
        if (!confirmed) return;
        await logout();
        navigate("/");
        setMobileMenuOpen(false);
    };

    const DropdownButton = ({ open, onClick, children }) => (
        <Button
            onClick={onClick}
            className={`text-white normal-case ${open ? "font-bold bg-[#490101]" : ""
                } hover:bg-[#5f0404]`}
            endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
            {children}
        </Button>
    );

    const DropdownMenu = ({ open, children }) =>
        open && (
            <div className="absolute top-full left-0 bg-[#8b0505] rounded shadow-lg z-50 min-w-[200px]">
                {children}
            </div>
        );

    const DropdownLink = ({ to, onClick, children }) => (
        <StyledNavLink
            to={to}
            onClick={onClick}
            className="block w-full px-4 py-2 hover:bg-[#5f0404]"
        >
            {children}
        </StyledNavLink>
    );

    const DropdownHeader = ({ children }) => (
        <div className="px-4 py-1 text-xs text-gray-300 border-y border-white/20">
            {children}
        </div>
    );

    return (
        <AppBar position="fixed" className="shadow-md" style={{ backgroundColor: "#7e0303" }}>
            <Toolbar className="justify-between px-2">
                {/* Brand */}
                <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-lg font-bold text-white"
                    style={{ textDecoration: "none" }}
                >
                    🍷 Liquor Web App
                </NavLink>

                {/* Desktop Menu */}
                {!isMobile && (
                    <div className="flex items-center gap-2">
                        <StyledNavLink to="/admin">Home</StyledNavLink>

                        {/* Management Panels */}
                        <div className="relative" ref={manageDropdownRef}>
                            <DropdownButton
                                open={manageDropDownOpen}
                                onClick={() => {
                                    setManageDropDownOpen((p) => !p);
                                    setStoreDropDownOpen(false);
                                }}
                            >
                                Management Panels
                            </DropdownButton>
                            <DropdownMenu open={manageDropDownOpen}>
                                <DropdownHeader>Manage Products</DropdownHeader>
                                <DropdownLink to="/liquor-list">Liquors</DropdownLink>
                                <DropdownLink to="/other-product-list">Groceries</DropdownLink>

                                <DropdownHeader>Manage Members</DropdownHeader>
                                {isSuperAdmin && (
                                    <DropdownLink to="/users-list">Users</DropdownLink>
                                )}
                                <DropdownLink to="/driver-list">Drivers</DropdownLink>
                                {isSuperAdmin && (
                                    <DropdownLink to="/admin-users-list">Admin Users</DropdownLink>
                                )}

                                <DropdownHeader>Manage Others</DropdownHeader>
                                <DropdownLink to="/category">Category</DropdownLink>
                                <DropdownLink to="/manage-banner">Banner</DropdownLink>
                            </DropdownMenu>
                        </div>

                        {/* Manage Store */}
                        <div className="relative" ref={storeDropdownRef}>
                            <DropdownButton
                                open={storeDropDownOpen}
                                onClick={() => {
                                    setStoreDropDownOpen((p) => !p);
                                    setManageDropDownOpen(false);
                                }}
                            >
                                Manage Store
                            </DropdownButton>
                            <DropdownMenu open={storeDropDownOpen}>
                                <DropdownLink to="/wharehouse">Warehouse</DropdownLink>
                                <DropdownLink to="/supermarket">Supermarket</DropdownLink>
                            </DropdownMenu>
                        </div>

                        <StyledNavLink to="/order-list">
                            <Badge
                                badgeContent={pendingCount}
                                color="error"
                                classes={{ badge: "bg-yellow-400 text-black right-[-10px] top-[6px]" }}
                            >
                                Orders
                            </Badge>
                        </StyledNavLink>

                        {isSuperAdmin && (
                            <>
                                <StyledNavLink to="/payments">Payments</StyledNavLink>
                                <StyledNavLink to="/reports">Reports</StyledNavLink>
                                <StyledNavLink to="/app-info">App Info</StyledNavLink>
                            </>
                        )}

                        <StyledNavLink to={`/profile/${user?._id || user?.id}`}>
                            Profile
                        </StyledNavLink>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                )}

                {/* Mobile Toggle */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={() => setMobileMenuOpen((p) => !p)}
                        aria-label="menu"
                    >
                        <Fade in={!mobileMenuOpen}>
                            <MenuIcon className="text-white text-2xl" />
                        </Fade>
                        <Fade in={mobileMenuOpen}>
                            <CloseIcon className="text-white text-2xl" />
                        </Fade>
                    </IconButton>
                )}
            </Toolbar>

            {/* Mobile Slide-down */}
            {isMobile && (
                <Slide direction="left" in={mobileMenuOpen} mountOnEnter unmountOnExit>
                    <div
                        ref={mobileMenuRef}
                        className="fixed right-0 top-[56px] sm:top-[64px] h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-[75vw] max-w-[300px] bg-[#7e0303] z-50 p-4 flex flex-col overflow-y-auto"
                    >
                        <StyledNavLink to="/admin">Home</StyledNavLink>

                        {/* Management Panels */}
                        <List disablePadding>
                            <ListItemButton
                                onClick={() => setManageDropDownOpen((p) => !p)}
                                className="text-white px-0"
                            >
                                <ListItemText primary="Management Panels" />
                                {manageDropDownOpen ? (
                                    <ExpandLess className="text-white" />
                                ) : (
                                    <ExpandMore className="text-white" />
                                )}
                            </ListItemButton>
                            <Collapse in={manageDropDownOpen}>
                                <div className="pl-3 flex flex-col">
                                    <ListSubheader
                                        className="bg-transparent p-0 m-0"
                                        style={{ color: "#d1d5dc" }}
                                    >
                                        Manage Products
                                    </ListSubheader>
                                    <StyledNavLink className="block w-full py-2" to="/liquor-list">
                                        Liquor
                                    </StyledNavLink>
                                    <StyledNavLink className="block w-full py-2" to="/other-product-list">
                                        Other Product
                                    </StyledNavLink>

                                    <ListSubheader
                                        className="bg-transparent p-0 m-0"
                                        style={{ color: "#d1d5dc" }}
                                    >
                                        Manage Members
                                    </ListSubheader>

                                    {isSuperAdmin && (
                                        <StyledNavLink className="block w-full py-2" to="/users-list">
                                            Users
                                        </StyledNavLink>
                                    )}
                                    <StyledNavLink className="block w-full py-2" to="/driver-list">
                                        Drivers
                                    </StyledNavLink>
                                    {isSuperAdmin && (
                                        <StyledNavLink className="block w-full py-2" to="/admin-users-list">
                                            Admin Users
                                        </StyledNavLink>
                                    )}

                                    <ListSubheader
                                        className="bg-transparent p-0 m-0"
                                        style={{ color: "#d1d5dc" }}
                                    >
                                        Manage Others
                                    </ListSubheader>
                                    <StyledNavLink className="block w-full py-2" to="/category">
                                        Category
                                    </StyledNavLink>
                                    <StyledNavLink className="block w-full py-2" to="/manage-banner">
                                        Banner
                                    </StyledNavLink>
                                </div>
                            </Collapse>
                        </List>

                        {/* Manage Store */}
                        <List disablePadding>
                            <ListItemButton
                                onClick={() => setStoreDropDownOpen((p) => !p)}
                                className="text-white px-0"
                            >
                                <ListItemText primary="Manage Store" />
                                {storeDropDownOpen ? (
                                    <ExpandLess className="text-white" />
                                ) : (
                                    <ExpandMore className="text-white" />
                                )}
                            </ListItemButton>
                            <Collapse in={storeDropDownOpen}>
                                <div className="pl-3 flex flex-col">
                                    <StyledNavLink className="block w-full py-2" to="/wharehouse">
                                        Warehouse
                                    </StyledNavLink>
                                    <StyledNavLink className="block w-full py-2" to="/supermarket">
                                        Supermarket
                                    </StyledNavLink>
                                </div>
                            </Collapse>
                        </List>

                        <StyledNavLink to="/order-list">
                            <Badge
                                badgeContent={pendingCount}
                                color="error"
                                classes={{ badge: "bg-yellow-400 text-black right-[-10px] top-[6px]" }}
                            >
                                Orders
                            </Badge>
                        </StyledNavLink>

                        <StyledNavLink to={`/profile/${user?._id || user?.id}`}>
                            Profile
                        </StyledNavLink>

                        {isSuperAdmin && (
                            <>
                                <StyledNavLink to="/app-info">App Info</StyledNavLink>
                                <StyledNavLink to="/payments">Payments</StyledNavLink>
                            </>
                        )}

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                        >
                            Logout
                        </Button>
                    </div>
                </Slide>
            )}
        </AppBar>
    );
};

export default AdminNavbar;
