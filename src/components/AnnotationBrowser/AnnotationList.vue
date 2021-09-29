<template>
  <div>
    <v-subheader>Annotation List</v-subheader>
    <v-data-table :items="filtered" :headers="headers">
      <!-- Tags -->
      <template v-slot:item.tags="{ item }">
        <v-chip
          v-for="tag in item.tags"
          :key="tag"
          x-small
          @click="clickedTag(tag)"
          >{{ tag }}</v-chip
        >
      </template>
      <!-- Index -->
      <template v-slot:item.id="{ item }">
        <span>{{ annotations.indexOf(item) }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import store from "@/store";
import annotationStore from "@/store/annotation";
import propertyStore from "@/store/properties";

import { IAnnotation, IAnnotationProperty } from "@/store/model";

@Component({
  components: {}
})
export default class AnnotationList extends Vue {
  readonly store = store;
  readonly annotationStore = annotationStore;
  readonly propertyStore = propertyStore;

  get annotations() {
    return this.annotationStore.annotations;
  }

  get filtered() {
    return this.annotationStore.filteredAnnotations;
  }

  get propertyIds() {
    return this.propertyStore.annotationListIds;
  }

  get properties() {
    return [
      ...this.propertyStore.morphologicProperties,
      ...this.propertyStore.relationalProperties,
      ...this.propertyStore.layerDependantProperties
    ].filter((property: IAnnotationProperty) =>
      this.propertyIds.includes(property.id)
    );
  }

  get headers() {
    return [
      {
        text: "Annotation Index",
        value: "id"
      },
      {
        text: "Shape",
        value: "shape"
      },
      {
        text: "Tags",
        value: "tags"
      },
      ...this.properties.map((property: IAnnotationProperty) => ({
        text: property.name,
        value: property.id
      }))
    ];
  }

  // TODO: all properties with property.list as header (even if not computed)

  @Emit("clickedTag")
  clickedTag(tag: string) {
    return tag;
  }
}
</script>
