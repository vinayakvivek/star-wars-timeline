import * as THREE from "three";
import { size } from "./config";

function disposeNode(node) {
  if (node instanceof THREE.Mesh) {
    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      if (node.material instanceof THREE.MeshFaceMaterial) {
        $.each(node.material.materials, function (idx, mtrl) {
          if (mtrl.map) mtrl.map.dispose();
          if (mtrl.lightMap) mtrl.lightMap.dispose();
          if (mtrl.bumpMap) mtrl.bumpMap.dispose();
          if (mtrl.normalMap) mtrl.normalMap.dispose();
          if (mtrl.specularMap) mtrl.specularMap.dispose();
          if (mtrl.envMap) mtrl.envMap.dispose();
          if (mtrl.alphaMap) mtrl.alphaMap.dispose();
          if (mtrl.aoMap) mtrl.aoMap.dispose();
          if (mtrl.displacementMap) mtrl.displacementMap.dispose();
          if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
          if (mtrl.gradientMap) mtrl.gradientMap.dispose();
          if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
          if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

          mtrl.dispose(); // disposes any programs associated with the material
        });
      } else {
        if (node.material.map) node.material.map.dispose();
        if (node.material.lightMap) node.material.lightMap.dispose();
        if (node.material.bumpMap) node.material.bumpMap.dispose();
        if (node.material.normalMap) node.material.normalMap.dispose();
        if (node.material.specularMap) node.material.specularMap.dispose();
        if (node.material.envMap) node.material.envMap.dispose();
        if (node.material.alphaMap) node.material.alphaMap.dispose();
        if (node.material.aoMap) node.material.aoMap.dispose();
        if (node.material.displacementMap)
          node.material.displacementMap.dispose();
        if (node.material.emissiveMap) node.material.emissiveMap.dispose();
        if (node.material.gradientMap) node.material.gradientMap.dispose();
        if (node.material.metalnessMap) node.material.metalnessMap.dispose();
        if (node.material.roughnessMap) node.material.roughnessMap.dispose();

        node.material.dispose(); // disposes any programs associated with the material
      }
    }
  }
} // disposeNode

export function disposeHierarchy(node) {
  for (var i = node.children.length - 1; i >= 0; i--) {
    var child = node.children[i];
    disposeHierarchy(child);
    disposeNode(child);
  }
}

export const updateOpacity = (mesh, opacity) => {
  mesh.traverse((node) => {
    if (node.material) {
      node.material.opacity = opacity;
      node.material.transparent = true;
    }
  });
}

const popupContainerEle = $("#popup-container");
const popupEle = $("#popup");
const popupBgEle = $("#popup-bg");
const popupIframeEle = $("#popup-iframe");
const t = 300;
let isPopupOpen = false;

const closePopup = () => {
  popupIframeEle.attr("src", "");
  popupContainerEle.hide(t);
  isPopupOpen = false;
};

export const openLinkPopup = (link) => {
  if (!link) return;
  popupContainerEle.show(t, () => {
    popupIframeEle.attr("src", link);
    isPopupOpen = true;
  });
};

popupBgEle.click(closePopup);

// popup buttons
$("#popup-close").click(closePopup);
$("#popup-new-tab").click(() => {
  window.open(popupIframeEle.attr("src"), "_blank").focus();
});

const yearWithSuffix = (year, offset) => {
  return Math.abs(year) + " " + (year + offset > 0 ? "ABY" : "BBY");
};
const tooltipHtml = (data) => {
  const getYear = () => {
    const y1 = yearWithSuffix(data.year, data.params.yearOffset);
    if (data.duration > 0) {
      const y2 = yearWithSuffix(data.year + data.duration, 0);
      return `Galactic Years: <span class="value">${y1} - ${y2}</span>`;
    }
    return `Galactic Year: <span class="value">${y1}</span>`;
  };
  return `
    <div class="tooltip-content">
      <p class="name">${data.name}</p>
      <p class="year">${getYear()}</p>
      <p class="type">Type: <span class="value">${data.type}</span></p>
      <p class="release-year">Release Year: <span class="value">${
        data.releaseDate[0]
      }</span></p>
    </div>
  `;
};

const tooltipEle = $("#tooltip");
const tooltipOffset = 10;
export const showTooltip = (data, x, y) => {
  // if data is null or the popup is open
  // hide the tooltip
  if (!data || isPopupOpen) {
    $("body").css("cursor", "default");
    tooltipEle.hide(1000);
    return;
  }

  tooltipEle.hide();
  tooltipEle.html(tooltipHtml(data));
  const left = Math.min(
    size.width - tooltipEle.width() - 20,
    x + tooltipOffset
  );
  const top = Math.min(
    size.height - tooltipEle.height() - 20,
    y + tooltipOffset
  );
  tooltipEle.css({
    top: top + "px",
    left: left + "px",
    position: "absolute",
  });
  $("body").css("cursor", "pointer");
  tooltipEle.show("slow");
};

// TODO: check and validate these two
export const throttle = (fn, limit) => {
  var waiting = false;
  return () => {
    if (!waiting) {
      fn.apply(this, arguments);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  }
}

export const debounce = (fn, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { fn.apply(this, args); }, timeout);
  }
}