<template>
  <v-card>
    <v-card-title>
      Property Calculator
    </v-card-title>
    <v-card-subtitle>Layer dependent properties</v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row v-for="property in layerDependantProperties" :key="property.id">
          <v-col ncols="2">
            <v-checkbox
              v-model="property.enabled"
              :label="property.name"
            ></v-checkbox>
          </v-col>
          <v-col>
            <!-- layer -->
            <v-select
              :items="layerItems"
              item-text="label"
              dense
              v-model="property.layer"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-subtitle>
      <span>Morphology Properties</span>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row v-for="property in morphologicProperties" :key="property.id">
          <v-col cols="1">
            <v-checkbox
              v-model="property.enabled"
              :label="property.name"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-subtitle>
      <span>Relational Properties</span>
    </v-card-subtitle>
    <v-card-text>
      <v-container>
        <v-row v-for="property in relationalProperties" :key="property.id">
          <v-col>
            <v-checkbox
              v-model="property.enabled"
              :label="property.name"
            ></v-checkbox>
          </v-col>
          <v-col>
            <tag-filter-editor :filter="property.filter"></tag-filter-editor>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import store from "@/store";
import propertyStore from "@/store/properties";

import TagFilterEditor from "@/components/TagFilterEditor.vue";
@Component({
  components: {
    TagFilterEditor
  }
})
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

  get layers() {
    return this.store.configuration?.view.layers || [];
  }

  get layerItems() {
    return this.layers.map((layer, index) => ({
      label: layer.name,
      value: index
    }));
  }
}
</script>
