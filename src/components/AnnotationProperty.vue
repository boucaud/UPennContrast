<template>
  <v-container>
    <v-subheader>
      Computed Annotation Properties
    </v-subheader>
    <v-row v-for="property in properties" :key="property.id">
      <v-col></v-col>
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

  get properties() {
    return propertyStore.properties;
  }
}
</script>
