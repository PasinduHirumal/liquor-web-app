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
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

// Styled NavLink for dark theme
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

const PublicNavbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => navigate("/login");
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          backgroundColor: "#a30000ff",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2 } }}>
          <Box
            component={NavLink}
            to="/"
            onClick={closeMobileMenu}
            style={{
              textDecoration: "none",
              color: "white",
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            🍷 Liquor Web App
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            <StyledNavLink to="/" onClick={closeMobileMenu}>
              Home
            </StyledNavLink>

            <StyledNavLink to="/liquor-all" onClick={closeMobileMenu}>
              Liquor Items
            </StyledNavLink>

            <StyledNavLink to="/other-product-all" onClick={closeMobileMenu}>
              Grocery Items
            </StyledNavLink>

            {/* 
            <Button
              variant="contained"
              sx={{
                ml: 2,
                backgroundColor: theme.palette.info.main,
                color: "#fff",
                "&:hover": {
                  backgroundColor: theme.palette.info.dark,
                },
              }}
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              Login
            </Button>
            */}

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
                bgcolor: "#7e0303ff",
                zIndex: theme.zIndex.drawer + 1,
                p: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StyledNavLink to="/" onClick={closeMobileMenu}>
                Home
              </StyledNavLink>

              <StyledNavLink to="/liquor-all" onClick={closeMobileMenu}>
                Liquor Items
              </StyledNavLink>

              <StyledNavLink to="/other-product-all" onClick={closeMobileMenu} sx={{ mb: 2 }}>
                Grocery Items
              </StyledNavLink>

              {/* 
              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  backgroundColor: theme.palette.info.main,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: theme.palette.info.dark,
                  },
                }}
                onClick={() => {
                  handleLogin();
                  closeMobileMenu();
                }}
              >
                Login
              </Button>
              */}

            </Box>
          </Slide>
        )}
      </AppBar>
    </>
  );
};

export default PublicNavbar;
