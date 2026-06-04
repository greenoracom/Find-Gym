import api from './api';

export const getActiveBanners = async () => {
  return api.get('/superadmin/cms/banners');
};
