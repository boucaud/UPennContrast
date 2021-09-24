<template>
  <v-container>
    <v-subheader>
      Property Calculator
    </v-subheader>
    <span>Layer dependent properties</span>
    <v-row v-for="property in layerDependantProperties" :key="property.id">
      <v-col>
        {{ property.name }}
      </v-col>
    </v-row>
    <span>Morphology Properties</span>
    <v-row v-for="property in morphologicProperties" :key="property.id">
      <v-col>
        {{ property.name }}
      </v-col>
    </v-row>
    <span>Relational Properties</span>
    <v-row v-for="property in relationalProperties" :key="property.id">
      <v-col>
        {{ property.name }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import store from "@/store";
import propertyStore from "@/store/properties";

@Component({})
export default class AnnotationProperties extends Vue {
  readonly store = store;
  readonly propertyStore = propertyStore;

  get morphologicProperties() {
    return propertyStore.morphologicProperties;
  }

  get layerDependantProperties() {
    return propertyStore.layerDependantProperties;
  }
  get relationalProperties() {
    return propertyStore.relationalProperties;
  }
}
</script>
