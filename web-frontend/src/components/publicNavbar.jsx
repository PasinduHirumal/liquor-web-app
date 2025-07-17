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

// Styled NavLink
const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: "none",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s ease",
  "&.active": {
    backgroundColor: theme.palette.primary.light,
    fontWeight: "bold",
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PublicNavbar = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => navigate("/login");
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
          <Box
            component={StyledNavLink}
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

            {!isAuthenticated && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
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
                <MenuIcon />
              </Fade>
              <Fade in={mobileMenuOpen} unmountOnExit>
                <CloseIcon />
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
                bgcolor: theme.palette.primary.dark,
                zIndex: theme.zIndex.drawer + 1,
                p: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <StyledNavLink to="/" onClick={closeMobileMenu} sx={{ mb: 2 }}>
                Home
              </StyledNavLink>

              {!isAuthenticated && (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<LoginIcon />}
                  onClick={() => {
                    handleLogin();
                    closeMobileMenu();
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Slide>
        )}
      </AppBar>

      {/* Add spacing so content below navbar isn't hidden */}
      <Toolbar />
    </>
  );
};

export default PublicNavbar;
