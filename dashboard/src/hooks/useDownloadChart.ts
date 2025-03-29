import { useRef } from "react";
import html2canvas from "html2canvas";
import * as culori from "culori";

/**
 * Reemplaza en una cadena todas las apariciones de colores en formato oklch
 * por su equivalente hexadecimal.
 */
function convertOklchInString(value: string): string {
  return value.replace(/oklch\([^)]+\)/g, (match) => {
    try {
      const parsed = culori.parse(match);
      if (parsed) {
        return culori.formatHex(parsed);
      }
    } catch (error) {
      console.error("Error al convertir oklch:", error);
    }
    return match;
  });
}

/**
 * Recorre el árbol de nodos de un elemento y para cada propiedad de color
 * que encuentre, convierte los valores en formato oklch a hexadecimal.
 * Además, actualiza el atributo style en caso de contener estilos inline.
 */
function processNode(node: HTMLElement) {
  // Actualiza el atributo style (si existe) realizando la conversión
  const inlineStyle = node.getAttribute("style");
  if (inlineStyle && inlineStyle.includes("oklch")) {
    node.setAttribute("style", convertOklchInString(inlineStyle));
  }

  const colorProperties = [
    "color",
    "background-color",
    "border-color",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
    "fill",
    "stroke",
  ];

  const computed = window.getComputedStyle(node);
  colorProperties.forEach((prop) => {
    const value = computed.getPropertyValue(prop);
    if (value && value.includes("oklch")) {
      const newValue = convertOklchInString(value);
      // Se fuerza la aplicación del estilo inline usando !important
      node.style.setProperty(prop, newValue, "important");
    }
  });

  Array.from(node.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      processNode(child);
    }
  });
}

export function useDownloadChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  const downloadChart = async (fileName: string = "chart.png") => {
    if (!chartRef.current) return;
    try {
      // Clonar el nodo de la gráfica
      const clone = chartRef.current.cloneNode(true) as HTMLElement;
      // Procesar el clon para convertir estilos inline
      processNode(clone);

      const legendWrapper = clone.querySelector('.recharts-legend-wrapper');
      
      if (legendWrapper) {
        legendWrapper.style.display = 'flex';
        legendWrapper.style.justifyContent = 'center';
        legendWrapper.style.width = '100%';
        legendWrapper.style.margin = '0 auto';
        legendWrapper.style.padding = '10px 0';
      }

      const tempContainer = document.createElement("div");
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-10000px';
      tempContainer.style.left = '-10000px';
      tempContainer.style.zIndex = '10000';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.appendChild(clone);

      const paddedWrapper = document.createElement("div");
      paddedWrapper.style.padding = '20px'; // 40px arriba/abajo, 20px lados
      paddedWrapper.style.display = 'flex';
      paddedWrapper.style.justifyContent = 'center';
      paddedWrapper.style.alignItems = 'center';
      paddedWrapper.style.width = 'fit-content';
      paddedWrapper.style.margin = '0 auto';
      paddedWrapper.appendChild(clone);
      tempContainer.appendChild(paddedWrapper);

      // Clonar y modificar las etiquetas <style> para reemplazar valores oklch
      const styleNodes = Array.from(document.querySelectorAll("style"));
      styleNodes.forEach((styleNode) => {
        const newStyle = document.createElement("style");
        newStyle.innerHTML = styleNode.innerHTML.replace(
          /oklch\([^)]+\)/g,
          (match) => {
            try {
              const parsed = culori.parse(match);
              if (parsed) {
                return culori.formatHex(parsed);
              }
            } catch (error) {
              console.error(
                "Error al convertir color en etiqueta de estilo:",
                error
              );
            }
            return match;
          }
        );
        tempContainer.appendChild(newStyle);
      });

      document.body.appendChild(tempContainer);

      // Capturar la imagen con html2canvas
      const canvas = await html2canvas(paddedWrapper);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error al descargar la gráfica:", error);
    }
  };

  return { chartRef, downloadChart };
}
