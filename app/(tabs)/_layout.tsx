import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BRAND } from '@/theme/brand';
import { useFavoritesStore } from '@/store/favoritesStore';

export default function TabLayout() {
  const favoriteCount = useFavoritesStore((s) => s.favoriteIds.length);
  const badge = favoriteCount > 0 ? (favoriteCount > 99 ? '99+' : favoriteCount) : undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND.gold,
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: BRAND.black,
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarBadgeStyle: {
          backgroundColor: BRAND.gold,
          color: BRAND.black,
          fontSize: 10,
          fontWeight: '700',
          minWidth: 18,
          lineHeight: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Catálogo',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarBadge: badge,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
