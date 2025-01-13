import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { RouteStretch } from '../types/routes';
import { FaRoute } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function RoutesScreen() {
  const window = useWindowDimensions();
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<RouteStretch[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from('route_stretches')
          .select(`
            *,
            waypoints (*)
          `)
          .order('sequence');

        if (error) throw error;
        if (data) setRoutes(data);
      } catch (err) {
        console.error('Erro ao buscar rotas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const getStatusColor = (status: RouteStretch['status']) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#0066cc';
      default: return isDark ? '#666' : '#9E9E9E';
    }
  };

  const getStatusText = (status: RouteStretch['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em curso';
      default: return 'Não Iniciado';
    }
  };

  const canStartRoute = (route: RouteStretch) => {
    const index = routes.findIndex(r => r.id === route.id);
    if (index === 0) return true;
    return routes[index - 1].status === 'completed';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    },
    containerDark: {
      backgroundColor: '#1a1a1a',
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      backgroundColor: 'white',
      padding: window.width < 768 ? 16 : 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerDark: {
      backgroundColor: '#2d2d2d',
      borderBottomColor: '#444',
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: window.width < 768 ? 8 : 12,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: window.width < 768 ? 12 : 16,
    },
    title: {
      fontSize: window.width < 768 ? 24 : 28,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    titleDark: {
      color: '#fff',
    },
    date: {
      fontSize: window.width < 768 ? 16 : 20,
      color: '#666',
    },
    dateDark: {
      color: '#999',
    },
    themeToggle: {
      padding: window.width < 768 ? 6 : 8,
      borderRadius: 50,
    },
    listContent: {
      padding: window.width < 768 ? 16 : 20,
    },
    routeItem: {
      backgroundColor: 'white',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    routeItemDark: {
      backgroundColor: '#2d2d2d',
    },
    routeItemDisabled: {
      opacity: 0.5,
    },
    routeContent: {
      padding: window.width < 768 ? 12 : 16,
    },
    routeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: window.width < 768 ? 8 : 12,
      flexWrap: 'wrap',
      gap: 8,
    },
    routeName: {
      fontSize: window.width < 768 ? 16 : 18,
      fontWeight: '600',
      color: '#333',
    },
    routeNameDark: {
      color: '#fff',
    },
    statusBadge: {
      paddingHorizontal: window.width < 768 ? 10 : 12,
      paddingVertical: window.width < 768 ? 4 : 6,
      borderRadius: 20,
    },
    statusText: {
      color: 'white',
      fontSize: window.width < 768 ? 12 : 14,
      fontWeight: '600',
    },
    routeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: window.width < 768 ? 6 : 8,
    },
    waypointsInfo: {
      fontSize: window.width < 768 ? 12 : 14,
      color: '#666',
    },
    waypointsInfoDark: {
      color: '#999',
    }
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDark ? '#66b3ff' : '#0066cc'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.titleRow}>
          <View style={styles.titleGroup}>
            <FaRoute size={window.width < 768 ? 20 : 24} color={isDark ? '#66b3ff' : '#0066cc'} />
            <Text style={[styles.title, isDark && styles.titleDark]}>Rota</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.date, isDark && styles.dateDark]}>
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
              })}
            </Text>
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
        </View>
      </View>

      <FlatList
        data={routes}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.routeItem,
              isDark && styles.routeItemDark,
              !canStartRoute(item) && item.status === 'not_started' && styles.routeItemDisabled
            ]}
            onPress={() => navigate(`/route/${item.id}`)}
            disabled={!canStartRoute(item) && item.status === 'not_started'}
          >
            <View style={styles.routeContent}>
              <View style={styles.routeHeader}>
                <Text style={[styles.routeName, isDark && styles.routeNameDark]}>
                  {item.name}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>
              <View style={styles.routeFooter}>
                <Text style={[styles.waypointsInfo, isDark && styles.waypointsInfoDark]}>
                  {item.waypoints.length} pontos de passagem
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}