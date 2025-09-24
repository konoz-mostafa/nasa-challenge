export const layerCategories = {
  Featured: [
    {
      name: "True Color (Terra)",
      id: "MODIS_Terra_CorrectedReflectance_TrueColor",
      type: "base",
      format: "jpg",
    },
    {
      name: "True Color (Aqua)",
      id: "MODIS_Aqua_CorrectedReflectance_TrueColor",
      type: "base",
      format: "jpg",
    },
    {
      name: "Night Lights (2012)",
      id: "VIIRS_CityLights_2012",
      type: "overlay",
      format: "jpg",
    },
  ],
  "Hazards & Disasters": [
    {
      name: "Fires and Thermal Anomalies",
      id: "VIIRS_NOAA20_Thermal_Anomalies_375m_Day",
      type: "overlay",
      format: "png",
    },
    {
      name: "Dust Storms",
      id: "MODIS_Terra_Dust_Score",
      type: "overlay",
      format: "png",
    },
  ],
  Atmosphere: [
    {
      name: "Aerosol Optical Thickness",
      id: "MODIS_Terra_Aerosol",
      type: "overlay",
      format: "png",
    },
    {
      name: "Carbon Monoxide",
      id: "AIRS_L3_CarbonMonoxide_500hPa_Day",
      type: "overlay",
      format: "png",
    },
  ],
  Land: [
    {
      name: "Vegetation Index (NDVI)",
      id: "MODIS_Terra_NDVI_16Day",
      type: "overlay",
      format: "png",
    },
    {
      name: "Land Surface Temperature (Day)",
      id: "MODIS_Terra_Land_Surface_Temp_Day",
      type: "overlay",
      format: "png",
    },
  ],
};
