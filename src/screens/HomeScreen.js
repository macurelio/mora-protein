import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, ImageBackground, useWindowDimensions } from 'react-native';
import { products } from '../data/products';
import { ShoppingCart, Instagram } from 'lucide-react-native';
import { CartContext } from '../context/CartContext';

export default function HomeScreen({ navigation }) {
  const { addToCart, getCartCount } = useContext(CartContext);
  const [selectedCoverage, setSelectedCoverage] = useState({});
  const { width } = useWindowDimensions();

  // Categorías extraídas automáticamente
  const categories = [...new Set(products.map((p) => p.category))];

  // Hacer el diseño adaptable (responsive) para escritorio (web) y móvil
  const columns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  // Calculamos el ancho de cada tarjeta basado en las columnas y márgenes
  const containerPadding = 25; // padding total del contenedor (12.5 * 2)
  const cardMargin = 15; // margen total por tarjeta (7.5 * 2)
  const cardWidth = Math.floor((width - containerPadding - (cardMargin * columns)) / columns);

  const renderProduct = (item) => {
    const coverage = selectedCoverage[item.id] || item.coverageOptions?.[0];

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.card, { width: cardWidth }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.categoryTag}>{item.category}</Text>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.productFlavor} numberOfLines={1}>{item.flavor || item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>

          {item.coverageOptions?.length > 0 && (
            <View style={styles.coverageRow}>
              {item.coverageOptions.map(opt => (
                <TouchableOpacity
                  key={`${item.id}-${opt}`}
                  style={[styles.coverageOption, coverage === opt && styles.coverageSelected]}
                  onPress={() => setSelectedCoverage(prev => ({ ...prev, [item.id]: opt }))}
                >
                  <Text style={[styles.coverageText, coverage === opt && styles.coverageTextSelected]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>${item.price}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                const options = item.coverageOptions?.length ? { coverage } : {};
                addToCart(item, options);
                alert(`Agregado al carrito: ${item.name}${coverage ? ` (${coverage})` : ''}`);
              }}
            >
              <ShoppingCart color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/mora.protein');
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/barras-fondo-snacks.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageOpacity}
        resizeMode="cover"
      >
        <View style={styles.overlayContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.brandMora}>Mora<Text style={styles.brandProtein}>Protein</Text></Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={openInstagram} style={styles.iconButton}>
                <Instagram color="#1A1A1A" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
                <View>
                  <ShoppingCart color="#1A1A1A" size={24} />
                  {getCartCount() > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{getCartCount()}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>Nuestro Menú</Text>
              <Text style={styles.subtitle}>Descubre todos nuestros snacks separadas por categoría.</Text>
            </View>

            {categories.map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              return (
                <View key={category} style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.categoryLine} />
                  </View>

                  <View style={styles.productsGrid}>
                    {categoryProducts.map(product => renderProduct(product))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9F8F6', // Color crema unificado como base
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageOpacity: {
    opacity: 0.55, // Aumentamos la opacidad para mayor nitidez
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(249, 248, 246, 0.4)', // Velo crema claro para no perder la lectura de las tarjetas
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(249, 248, 246, 0.85)', // Adaptado para integrarse mejor
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(235, 235, 235, 0.5)',
  },
  logoContainer: {
    backgroundColor: '#D7CFC2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  brandMora: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 26,
    letterSpacing: -1,
  },
  brandProtein: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 26,
    letterSpacing: -1,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
    padding: 8,
  },
  badgeContainer: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#000000',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#D7CFC2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  mainTitle: {
    color: '#1A1A1A',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoryTitle: {
    color: '#4a3c2f',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d6cdbf',
    opacity: 0.6,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12.5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Muy leve transparencia para que se sienta moderno
    borderRadius: 16,
    marginHorizontal: 7.5,
    marginBottom: 15,
    shadowColor: '#4a3c2f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    padding: 12,
  },
  productName: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  productDescription: {
    color: '#888888',
    fontSize: 11,
    marginBottom: 8,
    minHeight: 28,
    lineHeight: 14,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0e6d7',
    color: '#4a3c2f',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  productFlavor: {
    color: '#545454',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  coverageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  coverageOption: {
    borderWidth: 1,
    borderColor: '#d6cdbf',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  coverageSelected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  coverageText: {
    color: '#4a4a4a',
    fontSize: 10,
    fontWeight: '700',
  },
  coverageTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1A1A1A',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
