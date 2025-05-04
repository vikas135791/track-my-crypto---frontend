import 'chart.js';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    crosshair?: {
      line?: {
        color?: string;
        width?: number;
      };
      sync?: {
        enabled?: boolean;
        group?: number;
        suppressTooltips?: boolean;
      };
      zoom?: {
        enabled?: boolean;
        zoomboxBackgroundColor?: string;
        zoomboxBorderColor?: string;
        zoomButtonText?: string;
        zoomButtonClass?: string;
      };
      snap?: {
        enabled?: boolean;
      };
      callbacks?: {
        beforeZoom?: () => void;
        afterZoom?: () => void;
      };
    };
  }
}
