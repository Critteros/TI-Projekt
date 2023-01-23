import { debounce } from 'lodash';

import { getDefaultMenuSettings } from '@/client/settings/defaults';
import { MenuOptions } from '@/client/types/ui';
import { RendererSettings } from '@/client/types/rendering';

import { api } from '@/client/api';
import { SettingsGetResponseSchema, SettingsUpdateRequest } from '@/common/dto/settings';

export class DataManager {
  private globalDefaults: MenuOptions;
  private readonly mode: 'server' | 'local';
  private data: RendererSettings;

  constructor() {
    const defaults = getDefaultMenuSettings();
    this.globalDefaults = defaults;

    this.data = {
      particleCount: defaults.particleSliderSettings.initialValue,
      distance: defaults.distanceSliderSettings.initialValue,
      particleSize: defaults.sizeSliderSettings.initialValue,
      lineWidth: defaults.thicknessSliderSettings.initialValue,
    };
    if (window.session) {
      this.mode = 'server';
    } else {
      this.mode = 'local';
    }
  }

  public async initialValues() {
    if (this.mode === 'server') {
      const { data } = await api.private.get('/api/settings');
      const returnedData = await SettingsGetResponseSchema.parseAsync(data);

      if (returnedData.found) {
        const {
          settings: { particleSize, particleNumber, connectionDistance, lineThickness },
        } = returnedData;
        this.data = {
          particleCount: particleNumber,
          particleSize,
          distance: connectionDistance,
          lineWidth: lineThickness,
        };
      }
    } else {
      const data = localStorage.getItem('data');
      if (data) {
        this.data = JSON.parse(data) as RendererSettings;
      }
    }

    return {
      thicknessSliderSettings: {
        ...this.globalDefaults.thicknessSliderSettings,
        initialValue: this.data.lineWidth,
      },
      distanceSliderSettings: {
        ...this.globalDefaults.distanceSliderSettings,
        initialValue: this.data.distance,
      },
      sizeSliderSettings: {
        ...this.globalDefaults.sizeSliderSettings,
        initialValue: this.data.particleSize,
      },
      particleSliderSettings: {
        ...this.globalDefaults.particleSliderSettings,
        initialValue: this.data.particleCount,
      },
    } satisfies Partial<MenuOptions>;
  }

  private updateServerSettings = debounce(
    async () => {
      await api.private.post('/api/settings', {
        lineThickness: this.data.lineWidth,
        connectionDistance: this.data.distance,
        particleNumber: this.data.particleCount,
        particleSize: this.data.particleSize,
      } satisfies SettingsUpdateRequest);
    },
    200,
    {
      maxWait: 1000,
    },
  );
  public change(newSettings: Partial<RendererSettings>) {
    const newData = { ...this.data, ...newSettings };
    this.data = newData;
    if (this.mode === 'server') {
      this.updateServerSettings();
    } else {
      localStorage.setItem('data', JSON.stringify(newData));
    }
  }
}
