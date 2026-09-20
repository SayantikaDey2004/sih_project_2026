declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageStatic {
    getItem(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null>;
    setItem(key: string, value: string, callback?: (error?: Error) => void): Promise<void>;
    removeItem(key: string, callback?: (error?: Error) => void): Promise<void>;
    clear(callback?: (error?: Error) => void): Promise<void>;
    getAllKeys(callback?: (error?: Error, keys?: string[]) => void): Promise<string[]>;
    multiGet(keys: string[], callback?: (errors?: Error[], result?: [string, string | null][]) => void): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][], callback?: (errors?: Error[]) => void): Promise<void>;
    multiRemove(keys: string[], callback?: (errors?: Error[]) => void): Promise<void>;
  }
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module 'react-native-maps' {
  import { Component, ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface MapViewProps extends ViewProps {
    provider?: any;
    customMapStyle?: any[];
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    onRegionChangeComplete?: (region: Region) => void;
    mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain' | string;
    children?: any;
  }

  export class MapView extends Component<MapViewProps> {
    animateToRegion(region: Region, duration?: number): void;
  }

  export default MapView;

  export interface HeatmapProps extends ViewProps {
    points: Array<{ latitude: number; longitude: number; weight?: number }>;
    radius?: number;
    opacity?: number;
    gradient?: {
      colors: string[];
      startPoints: number[];
      colorMapSize?: number;
    };
  }

  export const Heatmap: ComponentType<HeatmapProps>;

  export interface MarkerProps extends ViewProps {
    coordinate: { latitude: number; longitude: number };
    title?: string;
    description?: string;
    pinColor?: string;
    onPress?: () => void;
    children?: any;
  }

  export const Marker: ComponentType<MarkerProps>;

  export interface CalloutProps extends ViewProps {
    children?: any;
  }

  export const Callout: ComponentType<CalloutProps>;

  export interface CircleProps extends ViewProps {
    center: { latitude: number; longitude: number };
    radius: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  }

  export const Circle: ComponentType<CircleProps>;
  export const PROVIDER_DEFAULT: any;
  export const PROVIDER_GOOGLE: any;
}

declare module 'react-native-gesture-handler' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';
  export const GestureHandlerRootView: ComponentType<ViewProps>;
}
