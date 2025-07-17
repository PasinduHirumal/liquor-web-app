import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    useMediaQuery,
    useTheme,
    styled,
    Slide,
    Fade,
    Collapse,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, Logout as LogoutIcon, ExpandMore, ExpandLess } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useAdminAuthStore from "../../stores/adminAuthStore";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: theme.palette.common.white,
    textDecoration: "none",
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.3s ease",
    "&.active": {
        backgroundColor: "#333",
        fontWeight: "bold",
    },
    "&:hover": {
        backgroundColor: "#444",
    },
}));

const AdminNavbar = () => {
    const navigate = useNavigate();
    const logout = useAdminAuthStore((state) => state.logout);
    const user = useAdminAuthStore((state) => state.user);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setManageOpen(false);
    };

    const toggleManage = () => setManageOpen((prev) => !prev);

    return (
        <>
            <AppBar position="fixed" elevation={4} sx={{ backgroundColor: "#121212" }}>
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
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                        <StyledNavLink to="/" onClick={closeMobileMenu}>
                            Home
                        </StyledNavLink>

                        <StyledNavLink
                            to="/liquor-list"
                            onClick={closeMobileMenu}
                        >
                            Manage Liquors
                        </StyledNavLink>

                        {/* Manage Dropdown simulated */}
                        <Box sx={{ position: "relative" }}>
                            <Button
                                onClick={() => setManageOpen((prev) => !prev)}
                                sx={{
                                    color: "white",
                                    textTransform: "none",
                                    fontWeight: manageOpen ? "bold" : "normal",
                                    bgcolor: manageOpen ? "#333" : "transparent",
                                    "&:hover": {
                                        bgcolor: "#444",
                                    },
                                }}
                                endIcon={manageOpen ? <ExpandLess /> : <ExpandMore />}
                            >
                                Manage Memberes
                            </Button>

                            {manageOpen && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        bgcolor: "#1e1e1e",
                                        borderRadius: 1,
                                        boxShadow: theme.shadows[5],
                                        zIndex: theme.zIndex.tooltip,
                                        minWidth: 140,
                                    }}
                                >
                                    <StyledNavLink
                                        to="/users-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Users
                                    </StyledNavLink>
                                    <StyledNavLink
                                        to="/driver-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Drivers
                                    </StyledNavLink>
                                    <StyledNavLink
                                        to="/admin-users-list"
                                        onClick={() => {
                                            closeMobileMenu();
                                            setManageOpen(false);
                                        }}
                                        style={{ display: "block", padding: "8px 16px" }}
                                    >
                                        Admin Users
                                    </StyledNavLink>
                                </Box>
                            )}
                        </Box>

                        <StyledNavLink
                            to={`/admin/profile/${user?._id || user?.id}`}
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
                            sx={{
                                position: "fixed",
                                top: { xs: 56, sm: 64 },
                                height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                                right: 0,
                                width: "75vw",
                                maxWidth: 300,
                                bgcolor: "#1e1e1e",
                                zIndex: theme.zIndex.drawer + 1,
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <StyledNavLink to="/" onClick={closeMobileMenu} sx={{ mb: 2 }}>
                                Home
                            </StyledNavLink>
                            <StyledNavLink
                                to={`/admin/profile/${user?._id || user?.id}`}
                                onClick={closeMobileMenu}
                                sx={{ mb: 2 }}
                            >
                                Profile
                            </StyledNavLink>

                            {/* Mobile Manage section */}
                            <List disablePadding sx={{ mb: 2, bgcolor: "transparent" }}>
                                <ListItemButton
                                    onClick={() => setManageOpen((prev) => !prev)}
                                    sx={{
                                        color: "white",
                                        px: 0,
                                        "&.Mui-expanded": {
                                            fontWeight: "bold",
                                        },
                                    }}
                                >
                                    <ListItemText primary="Manage Memberes" />
                                    {manageOpen ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
                                </ListItemButton>
                                <Collapse in={manageOpen} timeout="auto" unmountOnExit>
                                    <Box sx={{ pl: 2 }}>
                                        <StyledNavLink
                                            to="/users-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block", mb: 1 }}
                                        >
                                            Users
                                        </StyledNavLink>
                                        <StyledNavLink
                                            to="/driver-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block", mb: 1 }}
                                        >
                                            Drivers
                                        </StyledNavLink>
                                        <StyledNavLink
                                            to="/admin-users-list"
                                            onClick={closeMobileMenu}
                                            sx={{ display: "block" }}
                                        >
                                            Admin Users
                                        </StyledNavLink>
                                    </Box>
                                </Collapse>
                            </List>

                            <StyledNavLink
                                to="/liquor-list"
                                onClick={closeMobileMenu}
                                sx={{ mb: 2 }}
                            >
                                Manage Liquors
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
