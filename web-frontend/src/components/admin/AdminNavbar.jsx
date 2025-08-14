import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, IconButton, Button, Box, useMediaQuery, useTheme, styled, Slide, Fade,
    Collapse, List, ListItemButton, ListItemText, Typography, ListSubheader
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon, ExpandMore, ExpandLess } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import useAdminAuthStore from "../../stores/adminAuthStore";
import { getPendingOrdersCount } from "../../lib/orderApi";
import ConfirmLogoutDialog from "../../common/ConfirmLogoutDialog";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: theme.palette.common.white,
    textDecoration: "none",
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.3s ease",
    "&.active": {
        backgroundColor: "#490101ff",
        fontWeight: "bold",
    },
    "&:hover": {
        backgroundColor: "#5f0404ff",
    },
}));

const AdminNavbar = () => {
    const navigate = useNavigate();
    const logout = useAdminAuthStore((state) => state.logout);
    const user = useAdminAuthStore((state) => state.user);
    const isSuperAdmin = user?.role === 'super_admin' || user?.roles?.includes('super_admin');

    const theme = useTheme();
    const isMobile = useMediaQuery("(max-width:1150px)");

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [manageDropDownOpen, setManageDropDownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const count = await getPendingOrdersCount();
                setPendingCount(count);
            } catch (error) {
                console.error("Failed to fetch pending orders count:", error);
            }
        };

        fetchPendingCount();

        // Optionally refresh every X seconds:
        const interval = setInterval(fetchPendingCount, 60000); // every 60 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setManageDropDownOpen(false);
            }

            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('[aria-label="menu"]')
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const confirmed = await ConfirmLogoutDialog({
            title: "Confirm Logout",
            html: "Are you sure you want to log out?",
            icon: "warning"
        });

        if (!confirmed) return;

        await logout();
        navigate("/");
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setManageDropDownOpen(false);
    };

    return (
        <>
            <AppBar position="fixed" elevation={4} sx={{ backgroundColor: "#a30000ff" }}>
                <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2 } }}>
                    {/* Brand */}
                    <Box
                        component={NavLink}
                        to="/"
                        onClick={closeMobileMenu}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1.3rem",
                            fontWeight: "bold",
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        🍷 Liquor Web App
                    </Box>

                    {/* Desktop Navigation */}
                    <Box sx={{ display: isMobile ? "none" : "flex", alignItems: "center" }}>
                        <StyledNavLink to="/admin" onClick={closeMobileMenu}>
                            Home
                        </StyledNavLink>

                        {/* ManageProduct Dropdown simulated */}
                        <Box sx={{ position: "relative" }} ref={dropdownRef}>
                            <Button
                                onClick={() => setManageDropDownOpen((prev) => !prev)}
                                sx={{
                                    color: "white",
                                    textTransform: "none",
                                    fontWeight: manageDropDownOpen ? "bold" : "normal",
                                    bgcolor: manageDropDownOpen ? "#490101ff" : "transparent",
                                    "&:hover": {
                                        bgcolor: "#5f0404ff",
                                    },
                                }}
                                endIcon={manageDropDownOpen ? <ExpandLess /> : <ExpandMore />}
                            >
                                Management Panels
                            </Button>

                            {manageDropDownOpen && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        bgcolor: "#8b0505ff",
                                        borderRadius: 1,
                                        boxShadow: theme.shadows[5],
                                        zIndex: theme.zIndex.tooltip,
                                        minWidth: 140,
                                    }}
                                >
                                    {/* Manage Products */}
                                    <Typography variant="subtitle2" sx={{ px: 2, py: 0.5, color: "gray", fontSize: "16px" }}>
                                        Manage Products
                                    </Typography>

                                    <StyledNavLink
                                        to="/liquor-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageDropDownOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Liquors
                                    </StyledNavLink>
                                    <StyledNavLink
                                        to="/other-product-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageDropDownOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Groceries
                                    </StyledNavLink>

                                    {/* Manage Members */}
                                    <Typography variant="subtitle2" sx={{ px: 2, py: 0.5, color: "gray", fontSize: "16px" }}>
                                        Manage Members
                                    </Typography>

                                    {isSuperAdmin && (
                                        <StyledNavLink
                                            to="/users-list"
                                            onClick={() => {
                                                closeMobileMenu();
                                                setManageDropDownOpen(false);
                                            }}
                                            style={{ display: "block", padding: "8px 16px" }}
                                        >
                                            Users
                                        </StyledNavLink>
                                    )}

                                    <StyledNavLink
                                        to="/driver-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageDropDownOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Drivers
                                    </StyledNavLink>

                                    {isSuperAdmin && (
                                        <StyledNavLink
                                            to="/admin-users-list"
                                            onClick={() => {
                                                closeMobileMenu();
                                                setManageDropDownOpen(false);
                                            }}
                                            style={{ display: "block", padding: "8px 16px" }}
                                        >
                                            Admin Users
                                        </StyledNavLink>
                                    )}

                                    {/* Manage Others */}
                                    <Typography variant="subtitle2" sx={{ px: 2, py: 0.5, color: "gray", fontSize: "16px" }}>
                                        Manage Others
                                    </Typography>

                                    <StyledNavLink
                                        to="/category"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageDropDownOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Category
                                    </StyledNavLink>

                                    <StyledNavLink
                                        to="/manage-banner"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageDropDownOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Banner
                                    </StyledNavLink>
                                </Box>
                            )}
                        </Box>

                        <StyledNavLink to={`/order-list`} onClick={closeMobileMenu} sx={{ px: 3 }}>
                            <Badge
                                badgeContent={pendingCount}
                                color="error"
                                sx={{ "& .MuiBadge-badge": { right: -10, top: 6 } }}
                            >
                                <Box component="span" sx={{ pr: 1 }}>
                                    Orders
                                </Box>
                            </Badge>
                        </StyledNavLink>

                        <StyledNavLink
                            to={`/syetem-detail`}
                            onClick={closeMobileMenu}
                        >
                            System Detail
                        </StyledNavLink>

                        {isSuperAdmin && (
                            <StyledNavLink
                                to={`/download-reports`}
                                onClick={closeMobileMenu}
                            >
                                Download Report
                            </StyledNavLink>
                        )}

                        <StyledNavLink
                            to={`/profile/${user?._id || user?.id}`}
                            onClick={closeMobileMenu}
                            sx={{ mr: 2 }}
                        >
                            Profile
                        </StyledNavLink>

                        <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>

                    {/* Mobile Menu Icon */}
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={toggleMobileMenu}
                            aria-label="menu"
                            sx={{ ml: "auto" }}
                        >
                            <Fade in={!mobileMenuOpen} unmountOnExit>
                                <MenuIcon sx={{ color: "white", fontSize: 28 }} />
                            </Fade>
                            <Fade in={mobileMenuOpen} unmountOnExit>
                                <CloseIcon sx={{ color: "white", fontSize: 28 }} />
                            </Fade>
                        </IconButton>
                    )}
                </Toolbar>

                {/* Mobile Slide-down Menu */}
                {isMobile && (
                    <Slide direction="left" in={mobileMenuOpen} mountOnEnter unmountOnExit>
                        <Box
                            ref={mobileMenuRef}
                            sx={{
                                position: "fixed",
                                top: { xs: 56, sm: 64 },
                                height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                                right: 0,
                                width: "75vw",
                                maxWidth: 300,
                                bgcolor: "#7e0303ff",
                                zIndex: theme.zIndex.drawer + 1,
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "auto",
                            }}
                        >
                            <StyledNavLink to="/admin" onClick={closeMobileMenu} sx={{ mb: 2 }}>
                                Home
                            </StyledNavLink>

                            {/* Mobile ManageProduct section */}
                            <List disablePadding sx={{ mb: 2, bgcolor: "transparent" }}>
                                <ListItemButton
                                    onClick={() => setManageDropDownOpen((prev) => !prev)}
                                    sx={{
                                        color: "white",
                                        px: 0,
                                        "&.Mui-expanded": {
                                            fontWeight: "bold",
                                        },
                                    }}
                                >
                                    <ListItemText primary="Management panels" />
                                    {manageDropDownOpen ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
                                </ListItemButton>
                                <Collapse in={manageDropDownOpen} timeout="auto" unmountOnExit>
                                    <Box sx={{ pl: 2 }}>

                                        {/* Manage Products */}
                                        <ListSubheader disableSticky sx={{ color: "gray", bgcolor: "transparent", pl: 0 }}>
                                            Manage Products
                                        </ListSubheader>

                                        <StyledNavLink
                                            to="/liquor-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block", mb: 1 }}
                                        >
                                            Liquor
                                        </StyledNavLink>
                                        <StyledNavLink
                                            to="/other-product-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block", mb: 1 }}
                                        >
                                            Other Product
                                        </StyledNavLink>

                                        {/* Manage Members */}
                                        <ListSubheader disableSticky sx={{ color: "gray", bgcolor: "transparent", pl: 0 }}>
                                            Manage Members
                                        </ListSubheader>

                                        {isSuperAdmin && (
                                            <StyledNavLink
                                                to="/users-list"
                                                onClick={closeMobileMenu}
                                                sx={{ display: "block", mb: 1 }}
                                            >
                                                Users
                                            </StyledNavLink>
                                        )}

                                        <StyledNavLink
                                            to="/driver-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block", mb: 1 }}
                                        >
                                            Drivers
                                        </StyledNavLink>

                                        {isSuperAdmin && (
                                            <StyledNavLink
                                                to="/admin-users-list"
                                                onClick={closeMobileMenu}
                                                sx={{ display: "block", mb: 1 }}
                                            >
                                                Admin Users
                                            </StyledNavLink>
                                        )}

                                        {/* Manage Others */}
                                        <ListSubheader disableSticky sx={{ color: "gray", bgcolor: "transparent", pl: 0 }}>
                                            Manage Others
                                        </ListSubheader>

                                        <StyledNavLink
                                            to="/category"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block" }}
                                        >
                                            Category
                                        </StyledNavLink>
                                    </Box>
                                </Collapse>
                            </List>

                            <StyledNavLink to={`/order-list`} onClick={closeMobileMenu} sx={{ px: 3, mb: 2 }}>
                                <Badge
                                    badgeContent={pendingCount}
                                    color="error"
                                    sx={{ "& .MuiBadge-badge": { right: -10, top: 6 } }}
                                >
                                    <Box component="span" sx={{ pr: 1 }}>
                                        Orders
                                    </Box>
                                </Badge>
                            </StyledNavLink>

                            <StyledNavLink
                                to={`/syetem-detail`}
                                onClick={closeMobileMenu}
                                sx={{ mb: 2 }}
                            >
                                System Detail
                            </StyledNavLink>

                            {isSuperAdmin && (
                                <StyledNavLink
                                    to={`/download-reports`}
                                    onClick={closeMobileMenu}
                                >
                                    Download Report
                                </StyledNavLink>
                            )}

                            <StyledNavLink
                                to={`/profile/${user?._id || user?.id}`}
                                onClick={closeMobileMenu}
                                sx={{ mb: 2 }}
                            >
                                Profile
                            </StyledNavLink>

                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Slide>
                )}
            </AppBar>
        </>
    );
};

export default AdminNavbar;
