<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet.markercluster";
import type { Stop } from "../../types/ztm";

const props = defineProps<{
  stops: Stop[];
}>();

const emit = defineEmits<{
  select: [stop: Stop];
}>();

const mapElement = ref<HTMLDivElement | null>(null);

let map: L.Map | null = null;
let clusterGroup: L.MarkerClusterGroup | null = null;

function renderStops() {
  if (!map || !clusterGroup) return;

  clusterGroup.clearLayers();

  const validStops = props.stops.filter((stop) => {
    return stop.stopLat && stop.stopLon && stop.stopId && stop.stopName;
  });

  validStops.forEach((stop) => {
    const marker = L.marker([Number(stop.stopLat), Number(stop.stopLon)], {
      icon: L.divIcon({
        className: '',
        html: `
          <div class="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    });

    marker.bindPopup(`
      <strong>${stop.stopName}</strong><br />
      ID: ${stop.stopId}
    `);

    marker.on('mouseover', () => {
      marker.openPopup()
    })

    marker.on('mouseout', () => {
      marker.closePopup()
    })

    marker.on("click", () => {
      emit("select", stop);
    });

    clusterGroup?.addLayer(marker);
  });
}

onMounted(() => {
  if (!mapElement.value) return;

  map = L.map(mapElement.value).setView([54.352, 18.646], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  clusterGroup = L.markerClusterGroup();

  map.addLayer(clusterGroup);

  renderStops();
});

watch(
  () => props.stops,
  () => {
    renderStops();
  },
  { deep: true }
);
</script>

<template>
  <div ref="mapElement" class="h-screen w-screen"></div>
</template>