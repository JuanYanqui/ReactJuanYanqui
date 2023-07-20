import React, { useState } from 'react';
import { useTheme, Box, Typography, Card, CardHeader, CardContent, Accordion, AccordionSummary, AccordionDetails, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from 'react-query';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isLoading, error, data } = useQuery('faqData', () =>
    fetch('https://fakestoreapi.com/products').then((res) => res.json())
  );
  console.log(data);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // Nuevo estado para almacenar el precio total
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar la apertura del diálogo

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleAddToCart = (product) => {
    setCartItems((prevCartItems) => [...prevCartItems, product]);
    setTotalPrice((prevTotal) => prevTotal + product.price); // Actualizar el precio total
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevCartItems) => prevCartItems.filter((item) => item.id !== productId));
    const removedProduct = data.find((product) => product.id === productId);
    setTotalPrice((prevTotal) => prevTotal - removedProduct.price); // Actualizar el precio total
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleFinalize = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const renderCard = (product) => {
    const isAddedToCart = isInCart(product.id);

    return (
      <Card key={product.id} variant="outlined" sx={{ maxWidth: 300, margin: 1 }}>
        <CardHeader
          title={product.title}
          subheader={product.category}
        />
        <img src={product.image} alt={product.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
        <CardContent>
          <Typography variant="body1" component="p">
            {product.description}
          </Typography>
          <Typography variant="body2" component="p">
            Price: {product.price}
          </Typography>
          <IconButton
            color={isAddedToCart ? "error" : "success"}
            onClick={() => (isAddedToCart ? handleRemoveFromCart(product.id) : handleAddToCart(product))}
            size={isAddedToCart ? "large" : "medium"}
            sx={{ padding: '16px', fontSize: '2rem' }} // Ajustar el tamaño del botón y del icono
          >
            <ShoppingCartIcon sx={{ fontSize: '2rem' }} /> {/* Ajustar el tamaño del icono */}
          </IconButton>
          {/* Etiqueta en el botón según el estado del carrito */}
          {isAddedToCart ? "Quitar del carrito" : "Agregar al carrito"}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box m="20px" display="flex" flexDirection="column" alignItems="center">
      <Header title="PRODUCTOS" subtitle="API de Productos Consumida" />

      <Grid container spacing={2}>
        {data.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography color={colors.greenAccent[500]} variant="h5">
                  {product.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderCard(product)}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleFinalize}
          size="large"
          sx={{ fontSize: '1.5rem', padding: '16px 32px', minWidth: '200px' }}
        >
          Finalizar
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm" PaperProps={{ sx: { backgroundColor: '#4E6954' } }}>
        <DialogTitle sx={{ textAlign: 'center' }}>Total del Carrito</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
            El precio total de los productos en el carrito es: ${totalPrice.toFixed(2)}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );


};

export default FAQ;