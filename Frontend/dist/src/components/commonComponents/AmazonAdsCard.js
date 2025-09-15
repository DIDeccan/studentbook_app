import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { SH } from '../../utils/dimensions';

const { width: screenWidth } = Dimensions.get('window');

export default function AdsCarousel({
  autoPlayInterval = 3000,
  itemWidth = screenWidth,
  itemHeight = SH(270),
}) {
  const data = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      title: 'Summer Sale',
      description: 'Up to 50% off on summer essentials',
      ctaText: 'Shop Now',
      discount: '50% OFF',
      backgroundColor: '#FF6B6B'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      title: 'Prime Member Deals',
      description: 'Exclusive discounts for Prime members',
      ctaText: 'See Offers',
      discount: 'PRIME',
      backgroundColor: '#4ECDC4'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1555529771-7888783a18d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      title: 'New Arrivals',
      description: 'Discover the latest products',
      ctaText: 'Explore',
      discount: 'NEW',
      backgroundColor: '#FFD166'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      title: 'Electronics Sale',
      description: 'Top deals on gadgets and devices',
      ctaText: 'Buy Now',
      discount: '30% OFF',
      backgroundColor: '#118AB2'
    },
  ];

  const flatRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef(null);
  const resumeTimeout = useRef(null);

  const startAutoPlay = () => {
    if (data.length <= 1) return;
    if (autoplayRef.current) return;

    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % data.length;
        if (flatRef.current) {
          try {
            flatRef.current.scrollToIndex({ index: next, animated: true });
          } catch (e) {
            flatRef.current.scrollToOffset({ offset: next * itemWidth, animated: true });
          }
        }
        return next;
      });
    }, autoPlayInterval);
  };
  
  const stopAutoPlay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const pauseThenResume = () => {
    stopAutoPlay();
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      startAutoPlay();
    }, 4000);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      stopAutoPlay();
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ width: itemWidth, height: itemHeight }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          console.log('Ad pressed:', item);
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          {/* Discount Badge */}
          <View style={[styles.discountBadge, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
          
          {/* Title and Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          
          {/* CTA Button */}
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: item.backgroundColor }]}
            onPress={() => console.log('CTA pressed:', item)}
          >
            <Text style={styles.ctaText}>{item.ctaText}</Text>
          </TouchableOpacity>
        </View>
        
        {/* Dots overlay */}
        <View style={styles.dotsOverlay}>
          {data.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => jumpTo(i)} style={styles.dotTouchable}>
              <View style={[styles.dot, currentIndex === i ? styles.dotActive : null]} />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );

  const onMomentumScrollEnd = (ev) => {
    const offsetX = ev.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / itemWidth);
    setCurrentIndex(newIndex);
  };

  const onScrollBeginDrag = () => {
    pauseThenResume();
  };

  const jumpTo = (i) => {
    stopAutoPlay();
    if (flatRef.current) {
      try {
        flatRef.current.scrollToIndex({ index: i, animated: true });
      } catch (e) {
        flatRef.current.scrollToOffset({ offset: i * itemWidth, animated: true });
      }
    }
    setCurrentIndex(i);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => startAutoPlay(), 3000);
  };

  const getItemLayout = (_, index) => ({ length: itemWidth, offset: itemWidth * index, index });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={data}
        horizontal
        snapToInterval={itemWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 40,
  },
  discountBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },
  discountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  textContainer: {
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dotsOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotTouchable: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  dotActive: {
    width: 18,
    borderRadius: 10,
    backgroundColor: 'white'
  }
});