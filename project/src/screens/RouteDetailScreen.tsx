import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { MOCK_STRETCHES } from '../data/mockData';
import type { RouteStretch } from '../types/routes';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaRoute } from 'react-icons/fa';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZmllbGRjb3JwbWFwYm94IiwiYSI6ImNscjUyODVxMjAwdDYyanB4dGU3OGtraHgifQ.qY3vVHH3oDC8_CIQv-ogVw';

export default function RouteDetailScreen() {
  const window = useWindowDimensions();
  const navigate = useNavigate();
  const { id } = useParams();
  const [route, setRoute] = useState<RouteStretch | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Get user location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Fetch route data
  useEffect(() => {
    const fetchRoute = async () => {
      if (!id) return;
      try {
        const { data: supabaseData, error } = await supabase
          .from('route_stretches')
          .select(`
            *,
            waypoints (*)
          `)
          .match({ id })
          .single();

        if (error) throw error;
        
        if (supabaseData) {
          setRoute(supabaseData);
        } else {
          throw new Error('Route not found');
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        setError('Route not found');
        setRoute(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  // Initialize and update map
  useEffect(() => {
    if (!mapContainer.current || !route?.waypoints?.length) return;

    // Clean up previous map instance
    if (map.current) {
      markers.current.forEach(marker => marker.remove());
      map.current.remove();
      map.current = null;
    }

    try {
      setMapLoading(true);

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: isDark 
          ? 'mapbox://styles/mapbox/navigation-night-v1'
          : 'mapbox://styles/mapbox/streets-v12',
        center: [route.waypoints[0].longitude, route.waypoints[0].latitude],
        zoom: 12,
        attributionControl: false
      });

      // Add navigation control
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Wait for map to load
      map.current.on('load', () => {
        if (!map.current) return;

        // Clear existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Add user location marker if available
        if (userLocation && route.status === 'not_started') {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.backgroundColor = '#4CAF50';
          el.style.border = '2px solid white';
          el.style.borderRadius = '4px';
          el.style.color = 'white';
          el.style.textAlign = 'center';
          el.style.lineHeight = '28px';
          el.style.fontSize = '14px';
          el.style.fontWeight = 'bold';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.innerHTML = 'S';

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(userLocation)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML('<div>Starting Point</div>')
            )
            .addTo(map.current);
          
          markers.current.push(marker);
        }

        // Add waypoint markers
        route.waypoints.forEach((waypoint, index) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.backgroundColor = '#FF4444';
          el.style.border = '2px solid white';
          el.style.borderRadius = '4px';
          el.style.color = 'white';
          el.style.textAlign = 'center';
          el.style.lineHeight = '28px';
          el.style.fontSize = '14px';
          el.style.fontWeight = 'bold';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.innerHTML = `${index + 1}`;

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([waypoint.longitude, waypoint.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div style="color: ${isDark ? '#fff' : '#000'}">
                    <h3>Ponto ${index + 1}</h3>
                    <p>${waypoint.description}</p>
                  </div>
                `)
            )
            .addTo(map.current);
          
          markers.current.push(marker);
        });

        // Add route line
        const coordinates = route.waypoints.map(wp => [wp.longitude, wp.latitude]);
        
        if (map.current.getSource('route')) {
          (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          });
        } else {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#FF4444',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        }

        // Fit bounds to show all points
        const bounds = coordinates.reduce((bounds, coord) => {
          return bounds.extend(coord as [number, number]);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend(userLocation);
        }

        map.current.fitBounds(bounds, {
          padding: 50
        });

        setMapLoading(false);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Error loading map');
      setMapLoading(false);
    }

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [route, isDark, userLocation]);

  const startRoute = async () => {
    if (!route) return;

    // If route is not started, update its status
    if (route.status === 'not_started') {
      try {
        const { error } = await supabase
          .from('route_stretches')
          .update({ status: 'in_progress' })
          .eq('id', route.id);

        if (error) throw error;
      } catch (err) {
        console.error('Error updating route status:', err);
      }
    }

    // Get current location and open Google Maps
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Start with current location
        let waypointsStr = `${latitude},${longitude}`;
        
        // Add all waypoints
        route.waypoints.forEach(wp => {
          waypointsStr += `/${wp.latitude},${wp.longitude}`;
        });
        
        // Open in Google Maps
        globalThis.window.open(`https://www.google.com/maps/dir/${waypointsStr}`, '_blank');
        
        // Navigate back to routes page
        navigate('/routes');
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not get your current location. Please enable location services and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const getActionText = (status: RouteStretch['status']) => {
    switch (status) {
      case 'completed': return 'Visualizar';
      case 'in_progress': return 'Finalizar';
      default: return 'Iniciar';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100vh',
      backgroundColor: '#f5f5f5',
    },
    containerDark: {
      backgroundColor: '#1a1a1a',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: window.width < 768 ? 12 : 16,
      fontSize: window.width < 768 ? 14 : 16,
      color: '#333',
    },
    loadingTextDark: {
      color: '#fff',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: window.width < 768 ? 16 : 20,
    },
    errorText: {
      fontSize: window.width < 768 ? 14 : 16,
      color: '#ff4444',
      textAlign: 'center',
      marginBottom: window.width < 768 ? 16 : 20,
    },
    errorTextDark: {
      color: '#ff6666',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: window.width < 768 ? 16 : 20,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerDark: {
      backgroundColor: '#2d2d2d',
      borderBottomColor: '#444',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: window.width < 768 ? 8 : 12,
    },
    icon: {
      marginRight: window.width < 768 ? 4 : 8,
    },
    title: {
      fontSize: window.width < 768 ? 20 : 24,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    titleDark: {
      color: '#fff',
    },
    themeToggle: {
      padding: window.width < 768 ? 6 : 8,
      borderRadius: 50,
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    mapLoadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    mapDiv: {
      width: '100%',
      height: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: window.width < 768 ? 16 : 20,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    buttonContainerDark: {
      backgroundColor: '#2d2d2d',
      borderTopColor: '#444',
    },
    button: {
      flex: 1,
      padding: window.width < 768 ? 12 : 15,
      borderRadius: 8,
      marginHorizontal: window.width < 768 ? 8 : 10,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#D3D3D3',
    },
    startButton: {
      backgroundColor: '#4CAF50',
    },
    buttonText: {
      color: 'white',
      fontSize: window.width < 768 ? 14 : 16,
      fontWeight: 'bold',
    },
  });

  if (loading || !route) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#66b3ff' : '#0066cc'} />
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigate('/routes')}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleContainer}>
          <FaRoute size={window.width < 768 ? 20 : 24} color={isDark ? '#66b3ff' : '#0066cc'} style={styles.icon} />
          <Text style={[styles.title, isDark && styles.titleDark]}>{route.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.themeToggle}
          onPress={toggleTheme}
        >
          {isDark ? (
            <FiSun size={window.width < 768 ? 14 : 16} color="#fff" />
          ) : (
            <FiMoon size={window.width < 768 ? 14 : 16} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        {mapLoading && (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator size="large" color={isDark ? '#66b3ff' : '#0066cc'} />
            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
              Carregando mapa...
            </Text>
          </View>
        )}
        <div ref={mapContainer} style={styles.mapDiv} />
      </View>
      
      <View style={[styles.buttonContainer, isDark && styles.buttonContainerDark]}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigate('/routes')}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.startButton]}
          onPress={startRoute}
        >
          <Text style={styles.buttonText}>{getActionText(route.status)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}