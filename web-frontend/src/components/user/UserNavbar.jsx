import React, { useMemo, useState } from "react";
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
  Backdrop,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import useUserAuthStore from "../../stores/userAuthStore";
import SearchModal from "../../common/SearchModal";

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: "0.25s ease",
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 500,
  "&.active": {
    backgroundColor: "#a30404",
    fontWeight: 700,
  },
  "&:hover": {
    backgroundColor: "#a30404",
  },
}));

const StyledSearchButton = styled(IconButton)({
  color: "#fff",
  "&:hover": {
    backgroundColor: "#a30404",
  },
});

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
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  const navItems = useMemo(
    () => [
      { label: "Home", to: "/user" },
      { label: "Liquor Items", to: "/liquor-all" },
      { label: "Grocery Items", to: "/other-product-all" },
      { label: "Address", to: "/address" },
      { label: "Profile", to: user?.id ? `/profile/${user.id}` : "/profile" },
    ],
    [user?.id]
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      closeMenu();
      navigate("/");
    }
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
    <>
      <AppBar position="fixed" elevation={4} sx={{ backgroundColor: "#7e0303" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          <BrandLink to="/user" onClick={closeMenu}>
            🍷 Liquor Web App
          </BrandLink>

          {isMobile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <StyledSearchButton onClick={() => setSearchModalOpen(true)}>
                <SearchIcon />
              </StyledSearchButton>

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
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {renderLinks()}

              <StyledSearchButton onClick={() => setSearchModalOpen(true)}>
                <SearchIcon />
              </StyledSearchButton>

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
          <>
            <Backdrop
              open={mobileMenuOpen}
              onClick={closeMenu}
              sx={{
                zIndex: theme.zIndex.drawer,
                backgroundColor: "rgba(0,0,0,0.35)",
                top: { xs: 56, sm: 64 },
              }}
            />

            <Slide direction="left" in={mobileMenuOpen} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  position: "fixed",
                  top: { xs: 56, sm: 64 },
                  right: 0,
                  width: "78vw",
                  maxWidth: 320,
                  height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                  bgcolor: "#7e0303",
                  zIndex: theme.zIndex.drawer + 1,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  boxShadow: "-8px 0 24px rgba(0,0,0,0.25)",
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
          </>
        )}
      </AppBar>

      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}