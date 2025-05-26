import axios from 'axios';
// const PEXELS_API_KEY = '4GVBk1KtSoOG55kgOlSjTvEV9ujVwFbS5BudsGSk29JxDoNQi1UWx43m';

// export const FETCH_GALAXY_WALLPAPERS = 'FETCH_GALAXY_WALLPAPERS';

// export function fetchData() {
//     const config = {
//         headers: {
//             Authorization: PEXELS_API_KEY,
//         },
//         params: {
//             query: 'galaxy wallpaper',
//             per_page: 10,
//         },
//     };

//     const request = axios.get(`https://api.pexels.com/v1/search`, config);

//     return {
//         type: FETCH_GALAXY_WALLPAPERS,
//         payload: request,
//     };
// }

const PEXELS_API_KEY = '4GVBk1KtSoOG55kgOlSjTvEV9ujVwFbS5BudsGSk29JxDoNQi1UWx43m';

export const fetchData = async (page = 1, per_page = 10) => {
  const response = await axios.get('https://api.pexels.com/v1/search', {
    headers: {
      Authorization: PEXELS_API_KEY
    },
    params: {
      query: 'galaxy wallpaper',
      page,
      per_page
    }
  });

  return response.data;
};
