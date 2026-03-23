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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import useUserAuthStore from "../../stores/userAuthStore";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.25s ease",
  display: "inline-flex",
  alignItems: "center",
  "&.active": {
    backgroundColor: "#a30404",
    fontWeight: 700,
  },
  "&:hover": {
    backgroundColor: "#a30404",
  },
}));

const BrandLink = styled(NavLink)({
  color: "#fff",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  fontSize: "1.3rem",
  fontWeight: "bold",
});

export default function UserNavbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, logout } = useUserAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { label: "Home", to: "/user" },
    { label: "Liquors Items", to: "/liquor-all" },
    { label: "Grocery Items", to: "/other-product-all" },
    { label: "Address", to: "/address" },
    { label: "Profile", to: `/profile/${user?.id}` },
  ];

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  const renderLinks = (fullWidth = false) =>
    navItems.map(({ label, to }) => (
      <StyledNavLink
        key={to}
        to={to}
        onClick={closeMenu}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        {label}
      </StyledNavLink>
    ));

  return (
    <AppBar position="fixed" elevation={4} style={{ backgroundColor: "#7e0303" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        <BrandLink to="/" onClick={closeMenu}>
          🍷 Liquor Web App
        </BrandLink>

        {isMobile ? (
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            sx={{ position: "relative", width: 40, height: 40 }}
          >
            <Fade in={!mobileMenuOpen} unmountOnExit>
              <MenuIcon sx={{ position: "absolute", color: "#fff" }} />
            </Fade>
            <Fade in={mobileMenuOpen} unmountOnExit>
              <CloseIcon sx={{ position: "absolute", color: "#fff" }} />
            </Fade>
          </IconButton>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {renderLinks()}

            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ ml: 1, textTransform: "none", fontWeight: 600 }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>

      {isMobile && (
        <Slide direction="left" in={mobileMenuOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: "fixed",
              top: { xs: 56, sm: 64 },
              right: 0,
              width: "75vw",
              maxWidth: 300,
              height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
              bgcolor: "#7e0303",
              zIndex: theme.zIndex.drawer + 1,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {renderLinks(true)}

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Logout
            </Button>
          </Box>
        </Slide>
      )}
    </AppBar>
  );
}