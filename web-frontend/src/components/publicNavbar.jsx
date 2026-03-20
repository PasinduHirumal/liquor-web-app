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
  Search as SearchIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import SearchModal from "../common/SearchModal";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Liquor Items", to: "/liquor-all" },
  { label: "Grocery Items", to: "/other-product-all" },
];

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
    backgroundColor: "#490101",
    fontWeight: 700,
  },
  "&:hover": {
    backgroundColor: "#5f0404",
  },
}));

const StyledSearchButton = styled(IconButton)({
  color: "#fff",
  "&:hover": {
    backgroundColor: "#5f0404",
  },
});

const BrandLink = styled(NavLink)({
  textDecoration: "none",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  fontSize: "1.3rem",
  fontWeight: "bold",
});

export default function PublicNavbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const loginButtonSx = {
    backgroundColor: theme.palette.info.main,
    color: "#fff",
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "none",
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
      boxShadow: "none",
    },
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = (fullWidth = false) =>
    NAV_ITEMS.map(({ label, to }) => (
      <StyledNavLink
        key={to}
        to={to}
        onClick={closeMobileMenu}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        {label}
      </StyledNavLink>
    ));

  return (
    <>
      <AppBar position="fixed" elevation={4} sx={{ backgroundColor: "#a30000" }}>
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          <BrandLink to="/" onClick={closeMobileMenu}>
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
              {navLinks()}

              <StyledSearchButton onClick={() => setSearchModalOpen(true)}>
                <SearchIcon />
              </StyledSearchButton>

              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
                sx={loginButtonSx}
              >
                Login
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
              {navLinks(true)}

              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => {
                  closeMobileMenu();
                  navigate("/login");
                }}
                sx={loginButtonSx}
              >
                Login
              </Button>
            </Box>
          </Slide>
        )}
      </AppBar>

      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}