import React, { useState, useRef } from 'react';
import { Map as ReactMapGL, FullscreenControl } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
// import html2canvas from 'html2canvas';
import './assets/map.css';
import municipiosData from './assets/municipios.json';
import geoJsonData from './assets/geomunicipios_2019.json';
import Loading from './Loading';

const TKN = 'pk.eyJ1IjoibWJhcnJhZ2FuIiwiYSI6ImNsd3pzMWJiazBiNWoybG9lN2RiNG80eXEifQ.ao-pugU1GyloqZAlDFEJ6w';

const INITIAL_VIEW_STATE = {
  latitude: 19.3559748494,
  longitude: -99.6453705736,
  zoom: 8.0,
  bearing: 0,
  pitch: 20
};

const MunicipioInfo = ({ municipio }) => {
  const municipioData = municipiosData.find((m) => m.nombre_municipio === municipio);

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-gray-900 p-4 gap-4 rounded shadow-lg h-90 w-80">
      <span className="text-lg font-semibold text-white">{municipioData.nombre_municipio}</span>
      <div className="mt-2 text-sm">
        <table className="min-w-full table-auto text-white">
          <tbody>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Región:</td>
              <td className="px-4">{municipioData.region}</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Cabecera:</td>
              <td className="px-4">{municipioData.nombre_cabecera}</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Población Masculina:</td>
              <td className="px-4">{municipioData.poblacion_h.toLocaleString()}</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Población Femenina:</td>
              <td className="px-4">{municipioData.poblacion_m.toLocaleString()}</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Edad media (Hombres):</td>
              <td className="px-4">{municipioData.edad_h.toLocaleString()}</td>
            </tr>
            <tr className='border-b border-gray-700'>
              <td className="px-4 font-semibold">Edad media (Mujeres):</td>
              <td className="px-4">{municipioData.edad_m.toLocaleString()}</td>
            </tr>
            <tr>
              <td className="px-4 font-semibold">Viviendas habitadas:</td>
              <td className="px-4">{municipioData.viviendas_hab.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


const App = () => {  
  const [municipioSelected, setMunicipioSelected] = useState('Toluca');

  const createMap = () => {
    const geoJsonLayer = createCoropleth();
    
    return (
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[geoJsonLayer]}
        preserveDrawingBuffer={true}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'grab')}
      >
        <ReactMapGL
          mapStyle={"https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"}
          mapboxAccessToken={TKN}
          preserveDrawingBuffer={true}
        >
          <FullscreenControl />
        </ReactMapGL>
      </DeckGL>
    );
  };
  
  const createCoropleth = () => {
    return new GeoJsonLayer({
      id: municipioSelected,
      data: geoJsonData,
      filled: true,
      stroked: true,
      getFillColor: (feature) => {
        if (municipioSelected && feature.properties.mun_name === municipioSelected) {
          return [99, 102, 106, 220]; 
        }
        return [151, 153, 155, 120]; 
      },
      getLineColor: [99, 102, 106], 
      lineWidthMinPixels: 2,
      pickable: true,
      onClick: (info) => {
        const { object } = info;
        if (object) {
          handleMapClick(object.properties.mun_name);
        }
      },
    });
  };

  const handleMapClick = (municipio) => {
    setMunicipioSelected(municipio);
  };

  const captureScreenshot = () => {
    const mapContainer = document.querySelector('.map-container');
    
    html2canvas(mapContainer, {
      useCORS: true, 
      scrollX: 0,  
      scrollY: -window.scrollY,
      backgroundColor: null,
    }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL(); 
      link.download = `${municipioSelected || 'map'}.png`; 
      link.click();
    });
  };
  

  return (
    <div className='flex h-screen items-center jutify-center'>
      { (municipiosData.length === 0) 
        ? <Loading /> 
        : (
          <div className="map-container rounded-xl border border-gray-200 transition-all ">
            <div className="absolute top-4 left-4 z-10">
              <select
                value={municipioSelected}
                onChange={(e) => setMunicipioSelected(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Seleccione Municipio</option>
                {municipiosData.map((municipio) => (
                  <option key={municipio.id} value={municipio.nombre_municipio}>
                    {municipio.nombre_municipio}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="absolute bottom-4 left-4 z-10">
              <button
                onClick={captureScreenshot}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Capturar Pantalla
              </button>
            </div> */}
            { createMap() }
            { municipioSelected !== '' && <MunicipioInfo municipio={municipioSelected} /> }
          </div>
        )
      }
    </div>
  );
};

export default App;
