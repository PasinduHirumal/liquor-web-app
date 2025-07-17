import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import PublicNavbar from "../components/publicNavbar";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const PublicHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/getAll");
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <PublicNavbar isAuthenticated={false} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          All Products
        </Typography>

        <Grid container spacing={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: isSmDown ? "column" : "row",
                    height: isSmDown ? "auto" : 220,
                    opacity: product.is_active ? 1 : 0.7,
                    transition: "transform 0.2s ease-in-out",
                    ":hover": {
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  {product.images?.length > 0 ? (
                    <CardMedia
                      component="img"
                      image={product.images[0]}
                      alt={product.name}
                      sx={{
                        width: isSmDown ? "100%" : 180,
                        height: isSmDown ? 180 : "100%",
                        objectFit: "cover",
                        backgroundColor: theme.palette.grey[100],
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: isSmDown ? "100%" : 180,
                        height: isSmDown ? 180 : "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.palette.grey[100],
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No Image
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      flexGrow: 1,
                      p: 2,
                    }}
                  >
                    <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                      <Typography gutterBottom variant="h6" noWrap>
                        {product.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Category: {product.category_id?.name || "Uncategorized"}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Price:{" "}
                        <Typography component="span" fontWeight="bold">
                          ${product.price?.toFixed(2) || "0.00"}
                        </Typography>
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Stock: {product.stock_quantity || 0}
                      </Typography>

                      <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                        <Chip
                          label={product.is_active ? "Active" : "Inactive"}
                          color={product.is_active ? "success" : "default"}
                          size="small"
                        />
                        <Chip
                          label={product.is_in_stock ? "In Stock" : "Out of Stock"}
                          color={product.is_in_stock ? "primary" : "warning"}
                          size="small"
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        ID: {product.product_id}
                      </Typography>
                    </CardActions>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ width: "100%" }}>
                No products available.
              </Alert>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default PublicHome;
